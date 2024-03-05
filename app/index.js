// libs for github & graphql
const core = require('@actions/core');
const github = require('@actions/github');
const { parse } = require('json2csv');

// libs for csv file creation
const { dirname } = require("path");
const makeDir = require("make-dir");

// get the octokit handle 
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const octokit = github.getOctokit(GITHUB_TOKEN);

// inputs defined in action metadata file
const org_Name = core.getInput('org_name');
const csv_path = core.getInput('csv_path');
const is_delete = core.getInput('is_delete');
const inactive_only = core.getInput('inactive_only');
const inactive_days = core.getInput('inactive_days');

let totalSeats = 0;

// Our CSV output fields
const fields = [
    {
        label: 'User',
        value: 'assignee.login'
    },
    {
        label: 'Created At',
        value: 'created_at'
    },
    {
        label: 'Updated At',
        value: 'updated_at'
    },
    {
        label: 'Last Acivity At',
        value: 'last_activity_at'
    },
    {
        label: 'Last Acivity Editor',
        value: 'last_activity_editor'
    },
    {
        label: 'Pending Cancellation Date',
        value: 'pending_cancellation_date'
    },
    {
        label: 'Team',
        value: 'assigning_team.name'
    },
    {
        label: 'Status',
        value: 'status'
    }
];

// Copilot User Management API call
async function getUsage(org, pageNo) {
    try {

        return await octokit.request('GET /orgs/{org}/copilot/billing/seats', {
            org: org_Name,
            page: pageNo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

    } catch (error) {
        core.setFailed(error.message);
    }
}

// Extract Copilot usage data with a pagination of 50 records per page
async function run(org_Name, csv_path) {

    let addTitleRow = true;
    let pageNo = 1;
    let remainingRecs = 0;

    try {
        await makeDir(dirname(csv_path));
        do {
            // invoke the graphql query execution
            await getUsage(org_Name, pageNo).then(usageResult => {
                let seatsData = usageResult.data.seats;

                if (addTitleRow) {
                    totalSeats = usageResult.data.total_seats;
                    console.log('Seat Count ' + totalSeats);
                    remainingRecs = totalSeats;
                }

                // pagination to get next page data
                remainingRecs = remainingRecs - seatsData.length;
                console.log('Remaining Records ' + remainingRecs);
                
                console.log('inActive Only ' + inactive_only);
                console.log('inActive Days ' + inactive_days);
                console.log('is_delete ' + is_delete);

                if (inactive_only || inactive_only === 'true') {
                    // return only the inactive user list
                    seatsData = seatsData.filter(seat => {
                        return !seat.last_activity_at || seat.last_activity_at.trim() === '';
                    });
                }
                else {
                    // return the inactive users and users not active for last n days
                    seatsData = seatsData.filter(seat => {
                        const lastActivityDate = new Date(seat.last_activity_at);
                        const currentDate = new Date();
                        const diffInDays = Math.ceil((currentDate - lastActivityDate) / (1000 * 60 * 60 * 24));
                       
                        console.log('Last Activity Date ' + lastActivityDate);
                        console.log('Current Date ' + currentDate);
                        console.log('Diff in Days ' + diffInDays);
                        console.log('Inactive Days ' + inactive_days);

                        return (!seat.last_activity_at || seat.last_activity_at.trim() === '') || (diffInDays >= inactive_days);
                    });
                }

                // ALERT! - create our updated opts
                const opts = { fields, "header": addTitleRow };

                seatsData.forEach(seat => { seat.status = 'pending_cancellation';});
                if(is_delete || is_delete === 'true'){
                    // delete the user from copilot seat assignment
                    console.log('@@@@@@@@@@@@@@@@@@@@ Deleting User');
                    seatsData.forEach(seat => {
                        if(seat.assignee.login === 'amol1717'){
                            console.log('@@@@@@@@@@@@@@@@@@@@ Skipping User ' + seat.assignee.login);
                            seat.status = 'deleted';
                        }
                        
                       /* octokit.request('DELETE /orgs/{org}/copilot/billing/seats/{username}', {
                            org: org_Name,
                            username: seat.assignee.login,
                            headers: {
                                'X-GitHub-Api-Version': '2022-11-28'
                            }
                        });*/
                    });
                }
                 // append to the existing file (or create and append if needed)
                 require("fs").appendFileSync(csv_path, `${parse(seatsData, opts)}\n`);
                
                if (remainingRecs > 0) {
                    pageNo = pageNo + 1;
                    addTitleRow = false;
                }

            });
        } while (remainingRecs > 0);
    } catch (error) {
        core.setFailed(error.message);
    }
}

console.log(`preamble: org name: ${org_Name} `);

// run the action code
run(org_Name, csv_path);
