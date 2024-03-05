# Copilot User Management 
Regularly optimize cost and seat usage for an organization by removing unused Copilot for Business seat assignments from the Organization.

> If your organization has enabled Copilot access for all members, then the delete API will not work. Enable access for selected members in order to manage seats via the API. In this case, you can use the report to manually remove the seat assignments.


> Note: **4-Mar-2024** This Action uses the Copilot for Business API, which is in public Beta and subject to change


## PAT Token
Create a Fine-grained personal access tokens with 
       
  - **Resource owner** as Organization
  - **read & write** access to **GitHub Copilot for Business** under _Organization permissions_
        ![Screenshot 2023-08-01 at 4 09 43 PM](https://github.com/ambilykk/copilot-usage-report/assets/10282550/543d34a0-c0ab-40c7-a192-a2b7ab0fcd7c)

Pass this token as an input to the action - GITHUB_TOKEN


## Action in workflow

Include the copilot-user-mgmt action in your workflow. 

Sample workflow 0: Manual trigger to **Report** and **Eliminate** Users inactive for last n days

```
    name: Copilot User Management to Report Inactive Users

    on:
      workflow_dispatch:
          inputs:
              org_name: 
                description: 'Organization name'
                required: true
                default: 'octodemo'
              csv_path:
                description: 'CSV File path'
                required: true
                default: 'data/Copilot-Usage-Report.csv'
              is_delete:
                description: 'Eliminate Inactive Users and Users inactive for the past n days'
                required: false
                type: boolean
                default: false
              inactive_only:
                description: 'Remove only the inactive users from seat assignments'
                required: false
                type: boolean
                default:  false
              inactive_days:
                description: 'Number of days to identify an inactive user.'
                required: false
                default: '25'

    jobs:
      first-job:
        runs-on: ubuntu-latest
        
        steps:
          - name: Copilot User Management
            uses: ambilykk/copilot-user-mgmt@main
            with:        
              GITHUB_TOKEN: ${{ secrets.GH_TOK }}
              org_name: ${{ inputs.org_name }} 
              csv_path: ${{ inputs.csv_path }} 
              is_delete: ${{ inputs.is_delete }}
              inactive_only: ${{ inputs.inactive_only }}
              inactive_days: ${{ inputs.inactive_days }}
        
          - name: Upload Copilot Usage Report for Inactive Users
            uses: actions/upload-artifact@v4
            with:
              name: Copilot Usage Report
              path: ${{ inputs.csv_path }}   
     
```
This will shows all options in the workflow dispatch UI. You can select the options and trigger the workflow.
![Screenshot 2024-03-05 at 12 37 22 PM](https://github.com/ambilykk/copilot-user-mgmt/assets/10282550/4b9f56c2-a1ea-4365-a544-9d9df12c01d9)



Sample workflow 1: Copilot User Management to **Report** Inactive Users

```
    name: Copilot User Management to Report Inactive Users

    on:
      workflow_dispatch:

    jobs:
      first-job:
        runs-on: ubuntu-latest
        
        steps:
        - name: Copilot User Management
            uses: ambilykk/copilot-user-mgmt@main
            with:        
            GITHUB_TOKEN: ${{secrets.ORG_TOKEN}}
            org_name: 'octodemo'
            csv_path: data/Copilot-Usage-Report.csv
            inactive_only: true
        
        - name: Upload Copilot Usage Report for Inactive Users
            uses: actions/upload-artifact@v3
            with:
            name: Copilot Usage Report
            path: data/Copilot-Usage-Report.csv      
```

Sample workflow 2: Copilot User Management to **Eliminate** Inactive Users

```
    name: Copilot User Management to Eliminate Inactive Users

    on:
      workflow_dispatch:

    jobs:
      first-job:
        runs-on: ubuntu-latest
        
        steps:
        - name: Copilot User Management
            uses: ambilykk/copilot-user-mgmt@main
            with:        
            GITHUB_TOKEN: ${{secrets.ORG_TOKEN}}
            org_name: 'octodemo'
            csv_path: data/Copilot-Usage-Report.csv
            inactive_only: true
            is_delete: true
        
        - name: Upload Copilot Usage Report for Inactive Users
            uses: actions/upload-artifact@v3
            with:
            name: Copilot Usage Report
            path: data/Copilot-Usage-Report.csv      
```

Sample workflow 3: Revise Copilot User Management to **Report** Inactive Users and Users inactive for the past 50 days.

```
    name: Copilot User Management to Report Users inactive for last 50 days

    on:
      workflow_dispatch:

    jobs:
      first-job:
        runs-on: ubuntu-latest
        
        steps:
        - name: Copilot User Management
            uses: ambilykk/copilot-user-mgmt@main
            with:        
            GITHUB_TOKEN: ${{secrets.ORG_TOKEN}}
            org_name: 'octodemo'
            csv_path: data/Copilot-Usage-Report.csv
            inactive_days: 50
        
        - name: Upload Copilot Usage Report for Inactive Users
            uses: actions/upload-artifact@v3
            with:
            name: Copilot Usage Report
            path: data/Copilot-Usage-Report.csv      
```

Sample workflow 4: Revise Copilot User Management to **Eliminate** Inactive Users and Users inactive for the past 50 days.

```
    name: Copilot User Management to Eliminate Users inactive for last 50 days

    on:
      workflow_dispatch:

    jobs:
      first-job:
        runs-on: ubuntu-latest
        
        steps:
        - name: Copilot User Management
            uses: ambilykk/copilot-user-mgmt@main
            with:        
            GITHUB_TOKEN: ${{secrets.ORG_TOKEN}}
            org_name: 'octodemo'
            csv_path: data/Copilot-Usage-Report.csv
            inactive_days: 50
            is_delete: true
        
        - name: Upload Copilot Usage Report for Inactive Users
            uses: actions/upload-artifact@v3
            with:
            name: Copilot Usage Report
            path: data/Copilot-Usage-Report.csv      
```


## Parameters

| Name                           | Required  | Description                                                           |
|--------------------------------|------------|----------------------------------------------------------------------|
| GITHUB_TOKEN                 | Yes | PAT Token for access    |
| org_name                       | Yes | GitHub Organization Name                                      |
| csv_path                       | Yes | CSV file path for the Copilot Seat report                          |
| inactive_only                | No  | Report only inactive users. Default is false. If set as true, then only the inactive users who never used Copilot will be listed |
| inactive_days               | No  | Report users inactive for the past n days. Default is 25. If inactive_only set to false, system reports all inactive users with last active date as blank and who are inactive for n days |
| is_delete                      | No  | Delete the inactive users. Default is false. If it is false, only the report will be generated. If set as true, along with inactive user report, users will be removed form copilot seat assignment |

## Exported Fields
Following fields are included in the Copilot Usage Report
- User
- Created At
- Updated At
- Last Acivity At
- Last Acivity Editor
- Pending Cancellation Date
- Team
- Status - this field have the default value as 'pending_cancellation'. If the user is removed, this turned to 'deleted'

## Report
Copilot usage report is added as a build artifact in the workflow. You can download the report from the workflow run page.

![Screenshot 2023-08-01 at 4 14 10 PM](https://github.com/ambilykk/copilot-usage-report/assets/10282550/7fef1ea7-5bf8-4ba8-b5d7-95396d08693b)


# License

The scripts and documentation in this project are released under the [MIT License](./LICENSE)
