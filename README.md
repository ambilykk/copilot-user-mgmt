# Copilot User Management 
Regularly optimize cost and seat usage for an organization by removing unused Copilot for Business seat assignments from the Organization.

> Note: **4-Mar-2024** This Action uses the Copilot for Business API, which is in public Beta and subject to change

## PAT Token
Create a Fine-grained personal access tokens with 
       
  - **Resource owner** as Organization
  - **read & write** access to **GitHub Copilot for Business** under _Organization permissions_
        ![Screenshot 2023-08-01 at 4 09 43 PM](https://github.com/ambilykk/copilot-usage-report/assets/10282550/543d34a0-c0ab-40c7-a192-a2b7ab0fcd7c)

Pass this token as an input to the action - GITHUB_TOKEN


## Action in workflow

Include the copilot-user-mgmt action in your workflow. 

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
| csv_path                       | Yes | CSV file path                                   |
| inactive_only                | No  | Report only inactive users. Default is false. |
| inactive_days               | No  | Report users inactive for the past n days. Default is 25. |
| is_delete                      | No  | Delete the inactive users. Default is false. |

## Exported Fields
Following fields are included in the Copilot Usage Report
- User
- Created At
- Updated At
- Last Acivity At
- Last Acivity Editor
- Pending Cancellation Date
- Team

## Report
Copilot usage report is added as a build artifact in the workflow. You can download the report from the workflow run page.

![Screenshot 2023-08-01 at 4 14 10 PM](https://github.com/ambilykk/copilot-usage-report/assets/10282550/7fef1ea7-5bf8-4ba8-b5d7-95396d08693b)


# License

The scripts and documentation in this project are released under the [MIT License](./LICENSE)
