    
// Here is the filter pattern

// {$.eventName = CreateSecurityGroup}


var AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});

var zlib = require('zlib');

exports.handler = (event, context, callback) => {
    
    
    var payload = new Buffer(event.awslogs.data, 'base64');
    zlib.gunzip(payload, function(e, result) {
        if (e) { 
            context.fail(e);
        } else {
            result = JSON.parse(result.toString('ascii'));
            // console.log(result.logEvents);
            
            arraydata = result.logEvents[0]
            
            tojson = JSON.parse(arraydata.message);
             
            // console.log(tojson.userIdentity.userName);
            
            // console.log(tojson.responseElements.groupId);
            
             var owner = tojson.userIdentity.userName;
    
             var resourceid = tojson.responseElements.groupId;
                       
              // console.log(owner);
              // console.log(resourceid);            
    
        }
    
    // TODO implement
    // console.log('Security Group Created on ');
    // console.log(JSON.stringify(event));
    
    console.log(owner);
    console.log(resourceid);
    
    var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
    
    var sns = new AWS.SNS({apiVersion: '2010-03-31'});
    
    
                                 function  snsNotice() {
                                                var smsparams = {
                                                  Message: 'Notice! ' + owner + ' configured a security group with no tags. Tags have been automatically added. An owner tag value of ' + owner + ' has been added. For further assistance or questions please contact some-email@foobar.com\n\n Thanks\n\n Compliance Team',
                                                  Subject: 'Notice: No tags on AWS resource ',
                                                  TargetArn: 'arn:aws:sns:us-west-2:162723788887:no-tags'
                                                };
                                                sns.publish(smsparams, function(err, data) {
                                                  if (err) console.log(err, err.stack); // an error occurred
                                                  else     console.log(data);           // successful response
                                                });
                                 }
    
    
// Check if tags exist at all 


var params = {
  Filters: [
     {
    Name: "resource-id", 
    Values: [
       resourceid
    ]
   }
  ]
 };
    
ec2.describeTags(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else 
                
            // If no tags exist at all add owner tag and whatevr other tags are needed. Get em !
            
            if(Object.keys(data.Tags).length === 0 ){
                
                    // placeholder for  possible sns notification in future 
                    console.log("WARNING! Security group has no tags at all. Adding Tags")
                    
                             var params2 = {
                                      Resources: [
                                         resourceid
                                      ], 
                                      Tags: [
                                         {
                                        Key: "Owner", 
                                        Value: owner
                                       },
                                       {
                                        Key: "Environment", 
                                        Value: 'Production'
                                       }
                                      ]
                                     };
                                     ec2.createTags(params2, function(err, data) {
                                       if (err) console.log(err, err.stack); // an error occurred
                                       else     console.log(data);           // successful response
                                     });
                                     
                                     snsNotice();
            }      
                                     
                
    // If tags do exist then iterate through the tags and check if required tag "e.g. "Owner/Environment" exists. If they don't exist then add them 
    
    if(Object.keys(data.Tags).length > 0 ){
                     // console.log(Object.keys(data).length);
                     // console.log(Object.keys(data.Tags).length);
                     // console.log(data.Tags);
        
                       var index = 0, length = Object.keys(data.Tags).length;
                       var ownerExists = false;
                       var environment = false;
                       
                       // iterate through all the tags. set array key value index as the poosition in the loop 
        
                        for (index; index < length; index++) {
                            
                            // console.log(data.Tags[index]);
                            // console.log(data.Tags[index].Key);
                            if(data.Tags[index].Key == 'Owner'){
                                 ownerExists = true
                            }
                            if(data.Tags[index].Key == 'Environment'){
                                 environment = true
                            }  
                                
                            }
                            
                            // check if Owner tag exists 
        
                        if (ownerExists === false){
                            
                            // placeholder for  possible sns notification in future 
                             console.log("WARNING! Security group is non-compliant with Owner tag. Adding Tags")
                    
                       
                             var params3 = {
                                      Resources: [
                                         resourceid
                                      ], 
                                      Tags: [
                                         {
                                        Key: "Owner", 
                                        Value: owner
                                       }
                                      ]
                                     };
                                     ec2.createTags(params3, function(err, data) {
                                       if (err) console.log(err, err.stack); // an error occurred
                                       // else     console.log(data);           // successful response, maybe SNS in the future 
                                     });
                                     
                                     snsNotice();
                                     
                            
                        } // end of checking if owner exists 
                        
                        // check if Environment tag exists 
        
                      if (environment === false){
                                        // placeholder for  possible sns notification in future 
                                         console.log("WARNING! Security group is non-compliant with Enviroment tag. Adding Tags")


                                         var params4 = {
                                                  Resources: [
                                                     resourceid
                                                  ], 
                                                  Tags: [
                                                   {
                                                    Key: "Environment", 
                                                    Value: 'Production'
                                                   }
                                                  ]
                                                 };
                                                 ec2.createTags(params4, function(err, data) {
                                                   if (err) console.log(err, err.stack); // an error occurred
                                                   // else     console.log(data);           // successful response, maybe sns in the future 
                                                 });
                                                 
                                                 snsNotice();
                                                 
                                    } // end of checking for env tag
                                    
                                    // else if the tags exists then do nothing 
                                    
                                    else console.log("Nothing going here");
                        }     
                           
        });
        
        
    });    
    
}; // end of function 





