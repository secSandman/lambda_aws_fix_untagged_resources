# lambda aws fix_untagged resources
Retroactively fix and remediate untagged aws resources using lambda and send sns notifications to the guilty parties. 


# About 

Sometimes your compliance, security or finance team may require you to tag assets in the public cloud. This is great for versioning, knowing which region your asset is located, aggregrating assets to calculate spend, planning security efforts and provind guaditing results. <br>
<br>
For example, you may want to tag a group of servers with \n
\n
Application: MyBigSite.com \n
Region: East-1 \n
Environment: Dev \n
Version: v.01 \n
\n
Such a simple idea will allow you to aggregate digital assets and calcualte the $ spend on those assets. 
\n
You can also take advantage of this capability to create fine grained access controls to restrict who can make changes to the resources. This is great from a security perspective and even better for preventing accidal outages that can affect sales, project time lines or even avoding costs of your employees unecessarily adding resources that cost real $.
\n
Unfortunately scaling this approach can be hard. If you have thousands of employees and tens or hundreds of accounts then it can be difficult to enforce asset management across all of them. Sure you can enforce a Jenkins build pipeline in production but you will undoubtadly be left with some un accounted inventory.  
\n

To address this I've written a pretty simple Node.JS lambda script that monitors for new security groups and validated whether they are tagged or not tagged. If the code finds untagged or incorrect tags it then adds a "Owner" and "Environment". 

Although the code is written for security groups it can easilly be applied to almsot any other aws resources that need tagging. All you need to do is replicate the logic, construct new objects for the aws service and change the api calls to the Describe<Thing I want to Understand>. Then use the results from that description to find the tags and validate against your own ruleset. 
  
I have also added SNS code snippet to automatically notify the user who created the untagged users. The fucntion is snsNotify(). So any time you find a non compliant resource you can also send a little note to the user in case soemthing broke or they need an exeption for some reason. 


I'll be periodically adding new code here for other untagged resource as time permits. 


Thanks. 
  
