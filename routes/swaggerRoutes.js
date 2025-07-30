/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

module.exports = function (app) {
  /*Routes for auth*/
  app.post("/auth/social/login", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                                  #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                                  in: 'body',
                                  description: 'Some description...',
                                  schema: {
                                        $socialType: "",
                                        $facebookId: "", 
                                        $googleId: "",
                                        $appleId: "", 
                                        $fullName:"",
                                        $profileImage:"",
                                        $email:""
                                  }
                          } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/auth/signup", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                                #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               description: 'Some description...',
                                schema: {
                                      $firstName:"john",
                                      $lastName:"smith",
                                      $email:"john@toxsl.in",
                                      $countryCode: "+91",
                                      $mobile: "1234567895",
                                      $password: "Admin@123",
                                      $isTermsCondition:"true",
                                      $address:"mohali",
                                      $roleId:2,
                                      $deviceToken:"",
                                      $referralCode:"",

                                }
                       } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Signup Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/auth/login", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                                #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               description: 'Login with email or mobile',
                               schema: {
                                      $email: "john@toxsl.in",
                                      $countryCode: "+91",
                                      $mobile: "1234567895",
                                      $password: "Admin@123",
                                      $deviceToken:""
                               }
                       } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/auth/userLogin", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                                #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               description: 'Login with email or mobile',
                               schema: {
                                      $email: "john@toxsl.in",
                                      $countryCode: "+91",
                                      $mobile: "1234567895",
                                      $password: "Admin@123",
                                      $deviceToken:""
                               }
                       } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/verifyOtp", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Verify otp with emil or mobile',
                           schema: {
                               $email: "john@toxsl.in",
                               $countryCode: "+91",
                               $mobile: "1234567895",
                               $otp:1234
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Otp verified successfully' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/auth/forgotPassword", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Send otp with mobile or email',
                           schema: {
                               $email: "john@toxsl.in",
                               $countryCode: "+91",
                               $mobile: "1234567895",
                               $type:"1"
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Otp has been send to your phone no.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/resetPassword", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Reset password with email or mobile',
                           schema: {
                               $email: "john@toxsl.in",
                               $countryCode: "+91",
                               $mobile: "1234567895",
                               $password:"Admin@123"
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Otp has been send to your phone no.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/changePassword", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'changepassword with user token',
                           schema: {
                                  $oldPassword: "Admin@123",
                                  $password: "Admin@1234",
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Change Password Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/auth/profile", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/editProfile", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to edit user detail.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'profileImg',
             } 
      
             #swagger.parameters['firstName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 value:"john"
                 
             }
    
             #swagger.parameters['lastName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 value:"john"

                 
             }

              #swagger.parameters['countryCode'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'countryCode.',  
                 value:"+91"
   
             }
  
             #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Mobile No.', 
                 value:1236547895
    
             }

                #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'address', 
                 value:"mohali",
                 
             }  
                 
             
                #swagger.parameters['userName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'userName', 
                 value:"john smith",
                 
             }  

                #swagger.parameters['type'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'type', 
                 value:"1",
                 
             }  


            */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/auth/logout", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                        #swagger.description = 'Endpoint to user logout.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Logout successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/auth/deleteAccount", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
              #swagger.description = 'Endpoint to user Delete Account.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Logout successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/auth/passwordLink", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                                #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               description: 'Reset password link',
                               schema: {
                                      $email: "john@toxsl.in",
                                      $roleId:"2"
                               }
                       } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/auth/expireLink", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
            #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'changepassword with user token',
                           schema: {
                                  $email: "Admin@123",
                                  $token: "fhgbytg4ygttbr",
                           }
                   } */
    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*START CMS ROUTE*/
  app.post("/admin/cms/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CMS']
              #swagger.description = 'Endpoint to add cms.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['image'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'image',
             } 
  
             #swagger.parameters['title'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter title',
                 value:"About us"
             } 

               #swagger.parameters['arabicTitle'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter arabicTitle',
                 value:"معلومات عنا"
             } 

              #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter description',
                 value:"About us About us About usAbout us"
             } 

               #swagger.parameters['arabicDescription'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter arabicDescription',
                 value:"عنا عنا عنا عنا"
             } 
    
                #swagger.parameters['typeId'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'typeId',
                 value:1
     
             }

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/cms/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
           #swagger.description = 'Endpoint to get csm list.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                               in: 'query',
                               description: 'Enter pageNo.',
                               type: 'number',
                               value:1
                              }
                         */

    /* #swagger.parameters['pageLimit'] = {
                               in: 'query',
                               description: 'Enter pageLimit.',
                               type: 'number',
                               value:10
                              }
                         */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/cms/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
          #swagger.description = 'Endpoint to get single cms.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/cms/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                   #swagger.description = 'Endpoint to update single cms.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['image'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'image',
             } 
  
         #swagger.parameters['title'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter title',
                 value:"About us"
             } 

              #swagger.parameters['arabicTitle'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter arabicTitle',
                 value:"معلومات عنا"
             } 
    
                 #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter description',
                 value:"About us About us About usAbout us"
             } 

               #swagger.parameters['arabicDescription'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter arabicDescription',
                 value:"عنا عنا عنا عنا"
             } 
    
          #swagger.parameters['typeId'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'typeId',
                 value:1
     
             }

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/cms/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                 #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/cms/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
               #swagger.description = 'Endpoint to get delete cms.' 
     */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*START FAQs ROUTE*/
  app.post("/admin/faq/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['FAQ']
                                #swagger.description = 'Endpoint to add faq.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    $question: "What is question",
                                    $arabicQuestion: "ما هو السؤال",
                                    $answer: "What is answer",
                                    $arabicAnswer: "ما هو الجواب",
                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/faq/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to get faq list.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                           in: 'query',
                           description: 'Enter pageNo.',
                           type:'number',
                           value:1
                          }
                     */

    /* #swagger.parameters['pageLimit'] = {
                           in: 'query',
                           description: 'Enter pageLimit.',
                           type:'number',
                           value:10
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/faq/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to get single faq.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/faq/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
              #swagger.description = 'Endpoint to update single faq.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    $question: "What is question",
                                    $arabicQuestion: "ما هو السؤال",
                                    $answer: "What is answer",
                                    $arabicAnswer: "ما هو الجواب",

                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/faq/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/faq/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to delete faq.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/faq/faqList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to get faq list.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                           in: 'query',
                           description: 'Enter pageNo.',
                           type:'number',
                           value:1
                          }
                     */

    /* #swagger.parameters['pageLimit'] = {
                           in: 'query',
                           description: 'Enter pageLimit.',
                           type:'number',
                           value:10
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Add user Profile*/
  app.post("/admin/user/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                            #swagger.description = 'Endpoint to edit user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'profileImg',
             } 
  
             #swagger.parameters['email'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter email',
                 value:"john@toxsl.in"
             } 
    
             #swagger.parameters['firstName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 value:"john"

                 
             }
    
             #swagger.parameters['lastName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 value:"smith"

                 
             }
  

            #swagger.parameters['countryCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'countryCode.',
                 value:"+91"     
             }


             #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Mobile No.', 
                 value:1236547895
    
             }

               #swagger.parameters['roleId'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'roleId',    
                 value:2 
             }

              #swagger.parameters['company'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'company',    
                 value:"66ea7bb773d203679d5e5d0f"
             }

              #swagger.parameters['branch'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'branch',    
                 value:"66ea7bb773d203679d5e5d0f"
             }


            */
    if (expression) {
      // #swagger.responses[201] = { description: 'User Updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/user/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                            #swagger.description = 'Endpoint to edit user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'profileImg',
             } 
  
             #swagger.parameters['email'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter email',
                 value:"john@toxsl.in"
             } 
    
             #swagger.parameters['firstName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 value:"john"

                 
             }
    
             #swagger.parameters['lastName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 value:"smith"

                 
             }
  

            #swagger.parameters['countryCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'countryCode.',
                 value:"+91"     
             }


             #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Mobile No.', 
                 value:1236547895
    
             }

               #swagger.parameters['roleId'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'roleId',    
                 value:2 
             }


            */
    if (expression) {
      // #swagger.responses[201] = { description: 'User Updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/user/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                            #swagger.description = 'Endpoint to get  user list' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
                         in: 'query',
                         description: 'Enter stateId.',
                         type:'number',
                         value:1
                        }
                   */

    /* #swagger.parameters['search'] = {
                         in: 'query',
                         description: 'Enter search.',
                         type:'query',
                         value:"john"
                        }
                   */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.',
                         type:'number',
                         value:1
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.',
                         type:'number',
                         value:10
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'Users list found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/user/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                                     #swagger.description = 'Endpoint to get user detail.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/user/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                    #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.'
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/user/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                                     #swagger.description = 'Endpoint to get user detail.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/user/downloadLoginReport/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
        #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/user/resendEmail", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
           #swagger.description = 'Endpoint to get csm list.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                                  $subject: "",
                                  $description: ""                
                                  
                              }
                      } 
    */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/auth/activeUser", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
           #swagger.description = 'Endpoint to get csm list.' 
    */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/user/updateWallet/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                    #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    $amount: "50",
                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/user/updatePoint/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                    #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    $points: "10",
                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/cashback/cashbackList/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
        #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.',
                         type:'number',
                         value:1
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.',
                         type:'number',
                         value:10
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for dashboard*/
  app.get("/admin/dashboard/count", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DASHBOARD']
            #swagger.description = 'Endpoint to delete Error logs'
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/dashboard/graphData/:year", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DASHBOARD']
                            #swagger.description = 'Endpoint to delete Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['year'] = {
          in: 'path',
          description: 'Enter year.',
          type: 'string',
          example: 2024  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/dashboard/count", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DASHBOARD']
            #swagger.description = 'Endpoint to delete Error logs'
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Get Error-List*/
  app.get("/admin/logs/errorList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                            #swagger.description = 'Endpoint to get Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/logs/errorView/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                            #swagger.description = 'Endpoint to delete Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/logs/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                            #swagger.description = 'Endpoint to delete Error logs' */
    /* #swagger.security = [{ "Bearer": [] }] */
    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/logs/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                      #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Email delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for email*/
  app.get("/admin/emailLogs/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['EMAIL_LOG']
                       #swagger.description = 'Endpoint to get email list.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['state'] = {
                     in: 'query',
                     description: 'Enter state.'
                    }
               */

    /* #swagger.parameters['search'] = {
                     in: 'query',
                     description: 'Enter search.'
                    }
               */

    /* #swagger.parameters['pageNo'] = {
                     in: 'query',
                     description: 'Enter pageNo.'
                    }
               */

    /* #swagger.parameters['pageLimit'] = {
                     in: 'query',
                     description: 'Enter pageLimit.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'email list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/emailLogs/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['EMAIL_LOG']
                      #swagger.description = 'Endpoint to view email details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'email details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/emailLogs/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['EMAIL_LOG']
                      #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Email delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/emailLogs/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['EMAIL_LOG']
                          #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Emails delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for login history*/
  app.get("/admin/loginActivity/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['LOGIN_HISTORY']
                                   #swagger.description = 'Endpoint to get login history.' 
                            */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                 in: 'query',
                                 description: 'Enter pageNo.'
                                }
                           */

    /* #swagger.parameters['pageLimit'] = {
                                 in: 'query',
                                 description: 'Enter pageLimit.'
                                }
                           */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/loginActivity/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGIN_HISTORY']
                                  #swagger.description = 'Endpoint to view login activity details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'login activity details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/loginActivity/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGIN_HISTORY']
                                  #swagger.description = 'Endpoint to delete error log.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'error log  delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/loginActivity/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGIN_HISTORY']
                      #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Email delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes static pages*/
  app.get("/pages/cms/:typeId", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STATIC PAGES']
                        #swagger.description = 'Endpoint to get t&c,privacy pages.' */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for contactus*/
  app.post("/contactUs/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACTUS']
                            #swagger.description = 'Endpoint to add contactus.' */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $firstName: "",
                                  $lastName: "",
                                  $email: "",                                  
                                  $subject: "",
                                  $description:""                   
                                  
                              }
                      } 
    */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/contactUs/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CONTACTUS']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['state'] = {
                         in: 'query',
                         description: 'Enter state.'
                        }
                   */

    /* #swagger.parameters['search'] = {
                         in: 'query',
                         description: 'Enter state.'
                        }
                   */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/contactus/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACTUS']
                          #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/contactus/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACTUS']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for smtp*/
  app.post("/admin/smtp/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMTP']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                                  $password: "",                                  
                                  $host: "",
                                  $port:"",                          }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/smtp/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SMTP']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/smtp/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMTP']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/smtp/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMTP']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/smtp/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMTP']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                                  $password: "",                                  
                                  $host: "",
                                  $port:"",                          }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for backup*/
  app.post("/admin/db/backup", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DB_BACKUP']
                #swagger.description = 'Endpoint to add backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/db/backup/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DB_BACKUP']
                #swagger.description = 'Endpoint to list of all backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['page'] = {
                 in: 'query',
                 description: 'Enter pageNo.'
                }
           */

    /* #swagger.parameters['limit'] = {
                 in: 'query',
                 description: 'Enter pageLimit.'
                }
           */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/db/downloadBackup/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DB_BACKUP']
                #swagger.description = 'Endpoint to get single backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/db/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DB_BACKUP']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/db/download/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DB_BACKUP']
                #swagger.description = 'Endpoint to download backup file.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup downloaded successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for testimonial*/
  app.post("/admin/testimonial/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['TESTIMONIAL']
                                #swagger.description = 'Endpoint to add testimonial.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'profileImg',
             } 
  
             #swagger.parameters['name'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'name',
                 
             }
    
             #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'description',
                 
             }

    
         */

    if (expression) {
      // #swagger.responses[201] = { description: 'Testimonial added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/testimonial/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['TESTIMONIAL']
                                #swagger.description = 'Endpoint to add testimonial.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'profileImg',
             } 
    
             #swagger.parameters['name'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'name',
                 
             }
    
             #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'description',
                 
             }

    
         */

    if (expression) {
      // #swagger.responses[201] = { description: 'Testimonial Updated successfully .' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/testimonial/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['TESTIMONIAL']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/testimonial/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['TESTIMONIAL']
                                #swagger.description = 'Endpoint to add testimonial.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/testimonial/changeState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['TESTIMONIAL']
                                 #swagger.description = 'Endpoint to get csm list.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['state'] = {
                         in: 'query',
                         description: 'Enter state.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'Testimonial Updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/testimonial/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['TESTIMONIAL']
                                 #swagger.description = 'Endpoint to get csm list.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Testimonial Deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/testimonial/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['TESTIMONIAL']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['active'] = {
                         in: 'query',
                         description: 'Enter active.'
                        }
                   */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for category*/
  app.post("/admin/category/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['categoryImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'categoryImg',
             } 
  
             #swagger.parameters['category'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter category',
                 value:"Food"
             } 

               #swagger.parameters['arabicCategory'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter arabicCategory',
                 value:"طعام"
             }

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/category/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:"Food"
                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/category/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY']
            #swagger.description = 'Endpoint to view contactus details.'
     */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/category/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['categoryImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'categoryImg',
             } 
  
             #swagger.parameters['category'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter category',
                 value:"Food"

             } 

               #swagger.parameters['arabicCategory'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter arabicCategory',
                 value:"طعام"
             }

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/category/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/category/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/category/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/category/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY']
            #swagger.description = 'Endpoint to view contactus details.'
     */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/category/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/category/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY']
            #swagger.description = 'Endpoint to view contactus details.'
     */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/category/activeCategoryList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                     #swagger.description = 'Endpoint to get login history.' 
                              */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for sub category*/
  app.post("/admin/subcategory/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SUBCATEGORY']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['subCategoryImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'subCategoryImg',
             } 


               #swagger.parameters['subcategory'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter subcategory',
                 value:"Grocery"
             } 

             #swagger.parameters['categoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter categoryId',
                 value:"66e7cf0759160948ff3f1b90"
             } 

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/subcategory/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SUBCATEGORY']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'food'

                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/subcategory/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SUBCATEGORY']
                            #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/subcategory/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SUBCATEGORY']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['subCategoryImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'subCategoryImg',
             } 


            #swagger.parameters['subcategory'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter subcategory',
                 value:"Grocery"
             } 

             #swagger.parameters['categoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter categoryId',
                 value:"66e7cf0759160948ff3f1b90"
             } 

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/subcategory/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SUBCATEGORY']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/subcategory/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SUBCATEGORY']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/subcategory/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SUBCATEGORY']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['categoryId'] = {
                                   in: 'query',
                                   description: 'Enter categoryId.',
                                   type:'string',
                                   value:"66ea7172b6b64c3c94ce48c0"
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/subcategory/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SUBCATEGORY']
            #swagger.description = 'Endpoint to view contactus details.'
     */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/subcategory/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SUBCATEGORY']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['categoryId'] = {
                                   in: 'query',
                                   description: 'Enter categoryId.',
                                   type:'string',
                                   value:"66ea7172b6b64c3c94ce48c0"
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/subcategory/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SUBCATEGORY']
            #swagger.description = 'Endpoint to view contactus details.'
     */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/subcategory/activeSubcategoryList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SUBCATEGORY']
                     #swagger.description = 'Endpoint to get login history.' 
                              */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for delivery company*/
  app.post("/admin/deliverycompany/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DELIVERY_COMPANY']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */ /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['logo'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'logo',
             } 


               #swagger.parameters['company'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter company',
                 value:"abc"
             } 

               #swagger.parameters['arabicCompany'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter arabicCompany',
                 value:"abc"
             } 

                #swagger.parameters['country'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter country',
                 value:"abc"
             } 

                 #swagger.parameters['email'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter email',
                 value:'abc@toxsl.in'
             } 


             #swagger.parameters['companyCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter companyCode',
                 value:+91
             } 

               #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter mobile',
                 value:1236541254
             } 

              #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter description',
                 value:'description description description'
             } 

              #swagger.parameters['registration'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter registration',
                 value:'registration registration registration'
             } 

               #swagger.parameters['startTime'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter startTime',
                 value:"09:00"
             } 

                #swagger.parameters['endTime'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter endTime',
                 value:"20:00"
             } 

             #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter address',
                 value:"mohali"
             } 

               #swagger.parameters['contactPersonName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter contactPersonName',
                 value:"john"
             } 

               #swagger.parameters['contactPersonMobile'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter contactPersonMobile',
                 value:"+912541547854"
             } 

                #swagger.parameters['active'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Enter active',
                 value:"false"
             } 

                #swagger.parameters['costDeliveryOffrat'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter costDeliveryOffrat',
                 value:335
             } 

               #swagger.parameters['costDeliveryCustomer'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter costDeliveryCustomer',
                 value:400
             } 

              #swagger.parameters['default'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Enter default',
                 value:"false"
             }
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/deliverycompany/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DELIVERY_COMPANY']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */ /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['logo'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'logo',
             } 


               #swagger.parameters['company'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter company',
                 value:"abc"
             } 

               #swagger.parameters['arabicCompany'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter arabicCompany',
                 value:"abc"
             } 

                #swagger.parameters['country'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter country',
                 value:"abc"
             } 

                 #swagger.parameters['email'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter email',
                 value:'abc@toxsl.in'
             } 


             #swagger.parameters['companyCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter companyCode',
                 value:+91
             } 

               #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter mobile',
                 value:1236541254
             } 

              #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter description',
                 value:'description description description'
             } 

              #swagger.parameters['registration'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter registration',
                 value:'registration registration registration'
             } 

               #swagger.parameters['startTime'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter startTime',
                 value:"09:00"
             } 

                #swagger.parameters['endTime'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter endTime',
                 value:"20:00"
             } 

             #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter address',
                 value:"mohali"
             } 

               #swagger.parameters['contactPersonName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter contactPersonName',
                 value:"john"
             } 

               #swagger.parameters['contactPersonMobile'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter contactPersonMobile',
                 value:"+912541547854"
             } 

                #swagger.parameters['active'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Enter active',
                 value:"false"
             } 

                #swagger.parameters['costDeliveryOffrat'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter costDeliveryOffrat',
                 value:335
             } 

               #swagger.parameters['costDeliveryCustomer'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter costDeliveryCustomer',
                 value:400
             } 

              #swagger.parameters['default'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Enter default',
                 value:"false"
             }
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/deliverycompany/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DELIVERY_COMPANY']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'abc'

                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/deliverycompany/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DELIVERY_COMPANY']
              #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/deliverycompany/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DELIVERY_COMPANY']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/deliverycompany/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DELIVERY_COMPANY']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for company*/
  app.post("/admin/company/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['COMPANY']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */ /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['logo'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'logo',
             } 

               #swagger.parameters['coverImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'coverImg',
             } 


               #swagger.parameters['company'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter company',
                 value:"abc"
             } 

              #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter description',
                 value:"description"
             } 

             #swagger.parameters['perCommission'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter perCommission',
                 value:20
             } 

             #swagger.parameters['couponService'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Enter couponService',
                 value:'false'
             } 

               #swagger.parameters['deliveryEligible'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Enter deliveryEligible',
                 value:'false'
             } 

              #swagger.parameters['pickupService'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Enter pickupService',
                 value:'false'
             } 

              #swagger.parameters['deliveryCompany'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter deliveryCompany',
                 value:'abc'
             } 

               #swagger.parameters['costDelivery'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter costDelivery',
                 value:350
             } 

               #swagger.parameters['categoryId'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter categoryId',
                 value:"66ea7172b6b64c3c94ce48c0"
             } 

                #swagger.parameters['subcategoryId'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter subcategoryId',
                 value:"66ea7172b6b64c3c94ce48c0"
             } 
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/company/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['COMPANY']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['logo'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'logo',
             } 

                 #swagger.parameters['coverImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'coverImg',
             } 

               #swagger.parameters['company'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter company',
                 value:"abc"
             } 

               #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter description',
                 value:"description"
             } 

             #swagger.parameters['perCommission'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter perCommission',
                 value:20
             } 

             #swagger.parameters['couponService'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Enter couponService',
                 value:'false'
             } 

               #swagger.parameters['deliveryEligible'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Enter deliveryEligible',
                 value:'false'
             } 

              #swagger.parameters['pickupService'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Enter pickupService',
                 value:'false'
             } 

               #swagger.parameters['deliveryCompany'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter deliveryCompany',
                 value:'abc'
             } 

               #swagger.parameters['costDelivery'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter costDelivery',
                 value:350
             } 

                #swagger.parameters['categoryId'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter categoryId',
                 value:"66ea7172b6b64c3c94ce48c0"
             } 

                #swagger.parameters['subcategoryId'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter subcategoryId',
                 value:"66ea7172b6b64c3c94ce48c0"
             } 
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/company/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'abc'

                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/company/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['COMPANY']
                            #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/company/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/company/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['COMPANY']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/company/downloadCompanyReport/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['COMPANY']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['type'] = {
                                   in: 'query',
                                   description: 'Enter type.',
                                    type:'number',
                                   value:1
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/company/dropDownCompany", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/company/companyByCategory", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                         #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'treands'

                                  }
                             */

    /* #swagger.parameters['categoryId'] = {
                                   in: 'query',
                                   description: 'Enter categoryId.',
                                   type:'string',
                                   value:'66ebfad44d570cb186e335d3'

                                  }
                             */

    /* #swagger.parameters['subcategoryId'] = {
                                   in: 'query',
                                   description: 'Enter subcategoryId.',
                                   type:'string',
                                   value:'66ebfb0a4d570cb186e335ed'

                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    /* #swagger.parameters['electricCategory'] = {
                                   in: 'query',
                                   description: 'Enter electricCategory.',
                                   type:'string',
                                   value:'Electric'

                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/company/companyDetails/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['COMPANY']
                            #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/company/companyByCategory", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                         #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'treands'

                                  }
                             */

    /* #swagger.parameters['categoryId'] = {
                                   in: 'query',
                                   description: 'Enter categoryId.',
                                   type:'string',
                                   value:'66ebfad44d570cb186e335d3'

                                  }
                             */

    /* #swagger.parameters['subcategoryId'] = {
                                   in: 'query',
                                   description: 'Enter subcategoryId.',
                                   type:'string',
                                   value:'66ebfb0a4d570cb186e335ed'

                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    /* #swagger.parameters['electricCategory'] = {
                                   in: 'query',
                                   description: 'Enter electricCategory.',
                                   type:'string',
                                   value:'Electric'

                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/company/companyDetails/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['COMPANY']
                            #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("users/company/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/company/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
              #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/company/activeCompanyList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                     #swagger.description = 'Endpoint to get login history.' 
                              */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/company/couponCompany", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                     #swagger.description = 'Endpoint to get login history.' 
     */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/company/allCompany", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
              #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:"dream"
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/company/allCompany", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
              #swagger.description = 'Endpoint to get login history.' 
                              */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:"dream"
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/company/companyByOffer", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
              #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/company/companyByOffer", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
              #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/company/couponCompany", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                     #swagger.description = 'Endpoint to get login history.' 
     */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/company/electricCompany", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                     #swagger.description = 'Endpoint to get login history.' 
     */

    /* #swagger.parameters['electricCompany'] = {
                                   in: 'query',
                                   description: 'Enter electricCompany.',
                                   type:'string',
                                   value:"Electric"
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/company/electricCompany", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                     #swagger.description = 'Endpoint to get login history.' 
     */

    /* #swagger.parameters['electricCompany'] = {
                                   in: 'query',
                                   description: 'Enter electricCompany.',
                                   type:'string',
                                   value:"Electric"
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/company/popularToday", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                     #swagger.description = 'Endpoint to get login history.' 
     */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/company/popularToday", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                     #swagger.description = 'Endpoint to get login history.' 
     */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/company/companyByCategory/v1", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                         #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'treands'

                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/company/companyByCategory/v1", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COMPANY']
                         #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'treands'

                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for branch*/
  app.post("/admin/branch/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BRANCH']
           #swagger.description = 'Endpoint to add faq.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                     "branchName": "branchName",
                                     "area": "area",
                                    "isDeliveryPoint": false,
                                    "isCouponBranch": false,
                                    "CountryCode":"+91",
                                    "deliveryWhatsUpNo": "1254125424",
                                    "costDelivery": "355",
                                    "deliveryEmail": "gilmore@toxsl.in",
                                    "companyId": "66ea81eafadc10168a4eb86f",
                                    "workingHours": [
                                    {
                                     "day": "Sunday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Monday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Tuesday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                       {
                                     "day": "Wednesday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Thursday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                       {
                                     "day": "Friday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                     {
                                      "day": "Off"
                                     },
                                     {
                                     "day": "Saturday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      }
                                  ]

                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/branch/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BRANCH']
           #swagger.description = 'Endpoint to add faq.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    "branchName": "branchName",
                                    "area": "area",
                                    "isDeliveryPoint": false,
                                    "isCouponBranch": false,
                                    "CountryCode":"+91",
                                    "deliveryWhatsUpNo": "1254125424",
                                    "costDelivery": "355",
                                    "deliveryEmail": "gilmore@toxsl.in",
                                    "companyId": "66ea81eafadc10168a4eb86f",
                                    "workingHours": [
                                    {
                                     "day": "Sunday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Monday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Tuesday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                       {
                                     "day": "Wednesday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Thursday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                     {
                                     "day": "Friday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                     {
                                      "day": "Off"
                                     },
                                     {
                                     "day": "Saturday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      }
                                  ]
                              }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/branch/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRANCH']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'abc'

                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/branch/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BRANCH']
                            #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/branch/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRANCH']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/branch/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BRANCH']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/branch/companyFilter", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRANCH']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['companyId'] = {
                                   in: 'query',
                                   description: 'Enter companyId.',
                                   type:'string',
                                   value:"66ea9e9c163cd74571a881fd"
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/branch/branchByCompany", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRANCH']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['companyId'] = {
                                   in: 'query',
                                   description: 'Enter companyId.',
                                   type:'string',
                                   value:"66ea9e9c163cd74571a881fd"
                                  }
                             */

    /* #swagger.parameters['productId'] = {
                                   in: 'query',
                                   description: 'Enter productId.',
                                   type:'string',
                                   value:"66ea9e9c163cd74571a881fd"
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/branch/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BRANCH']
                            #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/users/branch/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BRANCH']
           #swagger.description = 'Endpoint to add faq.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                     "branchName": "branchName",
                                     "area": "area",
                                    "isDeliveryPoint": false,
                                    "isCouponBranch": false,
                                    "CountryCode":"+91",
                                    "deliveryWhatsUpNo": "1254125424",
                                    "costDelivery": "355",
                                    "deliveryEmail": "gilmore@toxsl.in",
                                    "companyId": "66ea81eafadc10168a4eb86f",
                                    "workingHours": [
                                    {
                                     "day": "Sunday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Monday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Tuesday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                       {
                                     "day": "Wednesday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Thursday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                       {
                                     "day": "Friday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                     {
                                      "day": "Off"
                                     },
                                     {
                                     "day": "Saturday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      }
                                  ]

                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/branch/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BRANCH']
           #swagger.description = 'Endpoint to add faq.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    "branchName": "branchName",
                                    "area": "area",
                                    "isDeliveryPoint": false,
                                    "isCouponBranch": false,
                                   "CountryCode":"+91",
                                    "deliveryWhatsUpNo": "1254125424",
                                    "costDelivery": "355",
                                    "deliveryEmail": "gilmore@toxsl.in",
                                    "companyId": "66ea81eafadc10168a4eb86f",
                                    "workingHours": [
                                    {
                                     "day": "Sunday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Monday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Tuesday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                       {
                                     "day": "Wednesday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                     },
                                     {
                                     "day": "Thursday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                     {
                                     "day": "Friday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      },
                                     {
                                      "day": "Off"
                                     },
                                     {
                                     "day": "Saturday",
                                     "startTime": "09:00",
                                     "endTime": "20:00",
                                      }
                                  ]
                              }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/branch/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRANCH']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'abc'

                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.put("/users/branch/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRANCH']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/branch/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BRANCH']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for product*/
  app.post("/users/product/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */ /*
          #swagger.consumes = ['multipart/form-data']  
       
              #swagger.parameters['productImg'] = {
                 in: 'formData',
                 type: 'array',
                 name:'productImg',
                 description: 'Add productImg...',
                 collectionFormat: 'multi',
                 items: { type: 'file' }
             }


               #swagger.parameters['productName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter productName',
                 value:"abc"
             } 

             #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter description',
                 value:"description"
             } 

             #swagger.parameters['price'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter price',
                 value:'600'
             } 

               #swagger.parameters['size'] = {
                 in: 'formData',
                 type: 'array',
                 description: 'Enter size',
             } 

              #swagger.parameters['color'] = {
                 in: 'formData',
                 type: 'array',
                 description: 'Enter color',
             } 

              #swagger.parameters['weight'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter weight',
                 value:'abc'
             } 

               #swagger.parameters['material'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter material',
                 value:"material"
             } 

               #swagger.parameters['model'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter model',
                 value:"model"
             } 


               #swagger.parameters['modelNumber'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter modelNumber',
                 value:"145UY"
             } 

              #swagger.parameters['productCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter productCode',
                 value:"1425"
             } 

              #swagger.parameters['serialCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter serialCode',
                 value:"1425"
             } 

             #swagger.parameters['power'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter power',
                 value:"power"
             } 

             #swagger.parameters['madeIn'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter madeIn',
                 value:"India"
             } 

              #swagger.parameters['warranty'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter warranty',
                 value:"2Years"
             } 

              #swagger.parameters['deliveryCost'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter deliveryCost',
                 value:"60"
             }
                 
             #swagger.parameters['pickupCost'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter pickupCost',
                 value:"60"
             }

             #swagger.parameters['discount'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter discount',
                 value:"60"
             }

               #swagger.parameters['prepareTime'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter prepareTime',
                 value:"40 Min"
             }

              #swagger.parameters['brand'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter brand',
                 value:"Apple"
             }

               #swagger.parameters['categoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter categoryId',
                 value:"66e95b98c99166491a9194c1"
             }

               #swagger.parameters['subcategoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter subcategoryId',
                 value:"66e975fbd23c0c39595334a5"
             }

                #swagger.parameters['mrpPrice'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter mrpPrice',
                 value:'20'
             } 

                #swagger.parameters['quantity'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter quantity',
                 value:'2'
             } 

             #swagger.parameters['sellerId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter sellerId',
                 value:'66e975fbd23c0c39595334a5'
             } 

               #swagger.parameters['classification'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter classification',
                 value:""
             }


               #swagger.parameters['startDate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter startDate',
                 value:""
             }


               #swagger.parameters['endDate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter endDate',
                 value:""
             }


               #swagger.parameters['termsCondition'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter termsCondition',
                 value:""
             }

               #swagger.parameters['order'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter order',
                 value:"1"
             }


               #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter latitude',
                 value:""
             }

             #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter longitude',
                 value:""
             }

             
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/product/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */ /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['productImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'productImg',
             } 


               #swagger.parameters['productName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter productName',
                 value:"abc"
             } 

             #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter description',
                 value:"description"
             } 

             #swagger.parameters['price'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter price',
                 value:'600'
             } 

               #swagger.parameters['size'] = {
                 in: 'formData',
                 type: 'array',
                 description: 'Enter size',
                 value:'[S,M]'
             } 

              #swagger.parameters['color'] = {
                 in: 'formData',
                 type: 'array',
                 description: 'Enter color',
                 value:'[red,blue]'
             } 

              #swagger.parameters['weight'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter weight',
                 value:'abc'
             } 

               #swagger.parameters['material'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter material',
                 value:"material"
             } 

               #swagger.parameters['model'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter model',
                 value:"model"
             } 


               #swagger.parameters['modelNumber'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter modelNumber',
                 value:"145UY"
             } 

              #swagger.parameters['productCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter productCode',
                 value:"1425"
             } 

              #swagger.parameters['serialCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter serialCode',
                 value:"1425"
             } 

             #swagger.parameters['power'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter power',
                 value:"power"
             } 

             #swagger.parameters['madeIn'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter madeIn',
                 value:"India"
             } 

              #swagger.parameters['warranty'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter warranty',
                 value:"2Years"
             } 

              #swagger.parameters['deliveryCost'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter deliveryCost',
                 value:"60"
             }
                 
             #swagger.parameters['pickupCost'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter pickupCost',
                 value:"60"
             }

             #swagger.parameters['discount'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter discount',
                 value:"60"
             }

               #swagger.parameters['prepareTime'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter prepareTime',
                 value:"40 Min"
             }

              #swagger.parameters['brand'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter brand',
                 value:"Apple"
             }

               #swagger.parameters['categoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter categoryId',
                 value:"66e95b98c99166491a9194c1"
             }

               #swagger.parameters['subcategoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter subcategoryId',
                 value:"66e975fbd23c0c39595334a5"
             }

              #swagger.parameters['mrpPrice'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter mrpPrice',
                 value:'20'
             } 

                #swagger.parameters['quantity'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter quantity',
                 value:'2'
             } 

              #swagger.parameters['classification'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter classification',
                 value:""
             }


               #swagger.parameters['startDate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter startDate',
                 value:""
             }


               #swagger.parameters['endDate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter endDate',
                 value:""
             }


               #swagger.parameters['termsCondition'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter termsCondition',
                 value:""
             }

              #swagger.parameters['order'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter order',
                 value:"1"
             }

               #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter latitude',
                 value:""
             }

             #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter longitude',
                 value:""
             }
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'abc'

                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                            #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/product/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/product/deleteImg/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                               "id": "66ebfad44d570cb186e335d3"
                            }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/userProduct", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']

           #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'abc'

                                  }
                             */

    /* #swagger.parameters['maxPrice'] = {
                                   in: 'query',
                                   description: 'Enter maxPrice.',
                                   type:'number',
                                   value:"100"
                                  }
                             */

    /* #swagger.parameters['minPrice'] = {
                                   in: 'query',
                                   description: 'Enter minPrice.',
                                   type:'number',
                                   value:"500"
                                  }
                             */

    /* #swagger.parameters['maxDiscount'] = {
                                   in: 'query',
                                   description: 'Enter maxDiscount.',
                                   type:'number',
                                   value:"30"
                                  }
                             */

    /* #swagger.parameters['minDiscount'] = {
                                   in: 'query',
                                   description: 'Enter minDiscount.',
                                   type:'number',
                                   value:"20"
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    /* #swagger.parameters['categoryArr'] = {
                                   in: 'query',
                                   description: 'Enter categoryArr.',
                                   type:'string',
                                   value:"66e95b98c99166491a9194c1"
                                  }
                             */

    /* #swagger.parameters['subCategoryArr'] = {
                                   in: 'query',
                                   description: 'Enter subCategoryArr.',
                                   type:'string',
                                   value:"66e95b98c99166491a9194c1"
                                  }
                             */

    /* #swagger.parameters['companyArr'] = {
                                   in: 'query',
                                   description: 'Enter companyArr.',
                                   type:'string',
                                   value:"66e95b98c99166491a9194c1"
                                  }
                             */

    /* #swagger.parameters['sort'] = {
                                   in: 'query',
                                   description: 'Enter sort.',
                                   type:'number',
                                   value:"100"
                                  }
                             */

    /* #swagger.parameters['classification'] = {
                                   in: 'query',
                                   description: 'Enter classification.',
                                   type:'string',
                                   value:"670cc63407681780ae3334b3"
                                  }
                             */

    /* #swagger.parameters['classificationCompany'] = {
                                   in: 'query',
                                   description: 'Enter classificationCompany.',
                                   type:'string',
                                   value:"670cc63407681780ae3334b3"
                                  }
                             */

    /* #swagger.parameters['classificationArr'] = {
                                   in: 'query',
                                   description: 'Enter classificationArr.',
                                   type:'string',
                                   value:"670cc63407681780ae3334b3"
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/product/userProduct", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'abc'

                                  }
                             */

    /* #swagger.parameters['companyId'] = {
                                   in: 'query',
                                   description: 'Enter companyId.',
                                   type:'string',
                                   value:"66e95b98c99166491a9194c1"
                                  }
                             */

    /* #swagger.parameters['maxPrice'] = {
                                   in: 'query',
                                   description: 'Enter maxPrice.',
                                   type:'number',
                                   value:"100"
                                  }
                             */

    /* #swagger.parameters['minPrice'] = {
                                   in: 'query',
                                   description: 'Enter minPrice.',
                                   type:'number',
                                   value:"500"
                                  }
                             */

    /* #swagger.parameters['maxDiscount'] = {
                                   in: 'query',
                                   description: 'Enter maxDiscount.',
                                   type:'number',
                                   value:"30"
                                  }
                             */

    /* #swagger.parameters['minDiscount'] = {
                                   in: 'query',
                                   description: 'Enter minDiscount.',
                                   type:'number',
                                   value:"20"
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    /* #swagger.parameters['companyArr'] = {
                                   in: 'query',
                                   description: 'Enter companyArr.',
                                   type:'string',
                                   value:"66e95b98c99166491a9194c1"
                                  }
                             */

    /* #swagger.parameters['sort'] = {
                                   in: 'query',
                                   description: 'Enter sort.',
                                   type:'number',
                                   value:"100"
                                  }
                             */

    /* #swagger.parameters['classification'] = {
                                   in: 'query',
                                   description: 'Enter classification.',
                                   type:'string',
                                   value:"670cc63407681780ae3334b3"
                                  }
                             */

    /* #swagger.parameters['classificationCompany'] = {
                                   in: 'query',
                                   description: 'Enter classificationCompany.',
                                   type:'string',
                                   value:"670cc63407681780ae3334b3"
                                  }
                             */

    /* #swagger.parameters['classificationArr'] = {
                                   in: 'query',
                                   description: 'Enter classificationArr.',
                                   type:'string',
                                   value:"670cc63407681780ae3334b3"
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/newArrival", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
    */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/product/newArrival", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
    */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/product/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                            #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/searchProductList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string'
                                
                            }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:6
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/product/searchProductList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string'
                                
                            }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:6
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.put("/users/product/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/bestSellerProduct", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/product/bestSellerProduct", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/sellerGraphProduct", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/ratingPerformance", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/userProducts", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'abc'

                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/product/userProducts", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'abc'

                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/product/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */ /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['productImg'] = {
                 in: 'formData',
                 type: 'array',
                 description: 'productImg',
                 items: { type: 'file' },
                 collectionFormat: 'multi',
             } 


               #swagger.parameters['productName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter productName',
                 value:"abc"
             } 

             #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter description',
                 value:"description"
             } 

             #swagger.parameters['price'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter price',
                 value:'600'
             } 

               #swagger.parameters['size'] = {
                 in: 'formData',
                 type: 'array',
                 description: 'Enter size',
             } 

              #swagger.parameters['color'] = {
                 in: 'formData',
                 type: 'array',
                 description: 'Enter color',
             } 

              #swagger.parameters['weight'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter weight',
                 value:'abc'
             } 

               #swagger.parameters['material'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter material',
                 value:"material"
             } 

               #swagger.parameters['model'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter model',
                 value:"model"
             } 


               #swagger.parameters['modelNumber'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter modelNumber',
                 value:"145UY"
             } 

              #swagger.parameters['productCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter productCode',
                 value:"1425"
             } 

              #swagger.parameters['serialCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter serialCode',
                 value:"1425"
             } 

             #swagger.parameters['power'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter power',
                 value:"power"
             } 

             #swagger.parameters['madeIn'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter madeIn',
                 value:"India"
             } 

              #swagger.parameters['warranty'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter warranty',
                 value:"2Years"
             } 

              #swagger.parameters['deliveryCost'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter deliveryCost',
                 value:"60"
             }
                 
             #swagger.parameters['pickupCost'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter pickupCost',
                 value:"60"
             }

             #swagger.parameters['discount'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter discount',
                 value:"60"
             }

               #swagger.parameters['prepareTime'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter prepareTime',
                 value:"40 Min"
             }

              #swagger.parameters['brand'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter brand',
                 value:"Apple"
             }

               #swagger.parameters['categoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter categoryId',
                 value:"66e95b98c99166491a9194c1"
             }

               #swagger.parameters['subcategoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter subcategoryId',
                 value:"66e975fbd23c0c39595334a5"
             }

                #swagger.parameters['mrpPrice'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter mrpPrice',
                 value:'20'
             } 

                #swagger.parameters['quantity'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter quantity',
                 value:'2'
             } 

               #swagger.parameters['company'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter company',
                 value:"66e975fbd23c0c39595334a5"
             }

               #swagger.parameters['branch'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter branch',
                 value:"66e975fbd23c0c39595334a5"
             }

              #swagger.parameters['classification'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter classification',
                 value:""
             }


               #swagger.parameters['startDate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter startDate',
                 value:""
             }


               #swagger.parameters['endDate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter endDate',
                 value:""
             }


               #swagger.parameters['termsCondition'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter termsCondition',
                 value:""
             }

               #swagger.parameters['order'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter order',
                 value:"1"
             }

               #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter latitude',
                 value:""
             }

             #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter longitude',
                 value:""
             }
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/product/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */ /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['productImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'productImg',
             } 


               #swagger.parameters['productName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter productName',
                 value:"abc"
             } 

             #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter description',
                 value:"description"
             } 

             #swagger.parameters['price'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter price',
                 value:'600'
             } 

               #swagger.parameters['size'] = {
                 in: 'formData',
                 type: 'array',
                 description: 'Enter size',
                 value:'[S,M]'
             } 

              #swagger.parameters['color'] = {
                 in: 'formData',
                 type: 'array',
                 description: 'Enter color',
                 value:'[red,blue]'
             } 

              #swagger.parameters['weight'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter weight',
                 value:'abc'
             } 

               #swagger.parameters['material'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter material',
                 value:"material"
             } 

               #swagger.parameters['model'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter model',
                 value:"model"
             } 


               #swagger.parameters['modelNumber'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter modelNumber',
                 value:"145UY"
             } 

              #swagger.parameters['productCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter productCode',
                 value:"1425"
             } 

              #swagger.parameters['serialCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter serialCode',
                 value:"1425"
             } 

             #swagger.parameters['power'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter power',
                 value:"power"
             } 

             #swagger.parameters['madeIn'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter madeIn',
                 value:"India"
             } 

              #swagger.parameters['warranty'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter warranty',
                 value:"2Years"
             } 

              #swagger.parameters['deliveryCost'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter deliveryCost',
                 value:"60"
             }
                 
             #swagger.parameters['pickupCost'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter pickupCost',
                 value:"60"
             }

             #swagger.parameters['discount'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter discount',
                 value:"60"
             }

               #swagger.parameters['prepareTime'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter prepareTime',
                 value:"40 Min"
             }

              #swagger.parameters['brand'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter brand',
                 value:"Apple"
             }

               #swagger.parameters['categoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter categoryId',
                 value:"66e95b98c99166491a9194c1"
             }

               #swagger.parameters['subcategoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter subcategoryId',
                 value:"66e975fbd23c0c39595334a5"
             }

              #swagger.parameters['mrpPrice'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter mrpPrice',
                 value:'20'
             } 

                #swagger.parameters['quantity'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter quantity',
                 value:'2'
             } 

              #swagger.parameters['classification'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter classification',
                 value:""
             }


               #swagger.parameters['startDate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter startDate',
                 value:""
             }


               #swagger.parameters['endDate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter endDate',
                 value:""
             }


               #swagger.parameters['termsCondition'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter termsCondition',
                 value:""
             }


               #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter latitude',
                 value:""
             }

             #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter longitude',
                 value:""
             }

             #swagger.parameters['order'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter order',
                 value:"1"
             }
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/product/pendingProduct", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:'abc'

                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'string',
                                   value:'66fe736f01cad6c7b1616b72'

                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                    type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/product/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                            #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/product/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/product/deleteImg/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                               "id": "66ebfad44d570cb186e335d3"
                            }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/product/downloadSample", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                            #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/product/importCsv", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                                    #swagger.description = 'Endpoint to import property file.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']

              #swagger.parameters['csvFile'] = {
                 in: 'formData',
                 type: 'array',
                 name:'csvFile',
                 description: 'Add csvFile...',
                 collectionFormat: 'multi',
                 items: { type: 'file' }
             }
             
             */

    if (expression) {
      // #swagger.responses[201] = { description: 'property file imoprt successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/product/downloadItemReport/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['COMPANY']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/product/deleteProduct/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                               "id": "66ebfad44d570cb186e335d3"
                            }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for wishlist*/
  app.post("/users/wishlist/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['WISHLIST']
                      #swagger.description = 'Endpoint to add wishlist.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $productId: "666fe917aa6a0a8da98cb4c3",
                            $companyId: "666fe917aa6a0a8da98cb4c3",
                            $type:"1",
                            $isWishlist: "true"
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'vote added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/wishlist/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['WISHLIST']
                #swagger.description = 'Endpoint to get all wish list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['type'] = {
             in: 'query',
             description: 'Enter type.'
            }
       */

    /* #swagger.parameters['pageNo'] = {
             in: 'query',
             description: 'Enter pageNo.'
            }
       */

    /* #swagger.parameters['pageLimit'] = {
             in: 'query',
             description: 'Enter pageLimit.'
            }
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'wish list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for cart*/
  app.post("/users/cart/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                    #swagger.description = 'Endpoint to add product in cart.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                          $branch:"",
                          $productId: "",
                          $purchase_Price:"" , 
                          $quantity: "",
                          $size:"",
                          $color:"",
                          $note:"",       
                       }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'product added in cart successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/cart/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
            #swagger.description = 'Endpoint to get cart list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['promoId'] = {
           in: 'query',
           description: 'Enter promoId.'
          }
     */

    /* #swagger.parameters['productId'] = {
           in: 'query',
           description: 'Enter productId.'
          }
     */

    /* #swagger.parameters['orderType'] = {
           in: 'query',
           description: 'Enter orderType.'
          }
     */
    if (expression) {
      // #swagger.responses[201] = { description: 'cart list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/cart/removeCart/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                    #swagger.description = 'Endpoint to reomove cart.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart removed successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/cart/clearCart", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                    #swagger.description = 'Endpoint to reomove cart.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart removed successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/cart/increaseQuantity/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                    #swagger.description = 'Endpoint to increase quantity.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                         $quantity: ""
                   }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart increased successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/cart/decreaseQuantity/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                    #swagger.description = 'Endpoint to increase quantity.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                    $quantity: ""
                 }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart increased successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /* public Routes for Cart */
  app.post("/cart/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                      #swagger.description = 'Endpoint to add product in cart.' */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $branch:"",
                            $productId: "",
                            $purchase_Price:"" , 
                            $quantity: "",
                            $size:"",
                            $color:"",
                            $note:"",  
                            $deviceToken : "",     
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'product added in cart successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/cart/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
              #swagger.description = 'Endpoint to get cart list.' */

    /* #swagger.parameters['promoId'] = {
             in: 'query',
             description: 'Enter promoId.'
            }
       */

    /* #swagger.parameters['productId'] = {
             in: 'query',
             description: 'Enter productId.'
            }
       */

    /* #swagger.parameters['orderType'] = {
             in: 'query',
             description: 'Enter orderType.'
            }
       */
    /* #swagger.parameters['deviceToken'] = {
             in: 'query',
             description: 'Enter deviceToken.'
            }
       */
    if (expression) {
      // #swagger.responses[201] = { description: 'cart list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/cart/removeCart/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                      #swagger.description = 'Endpoint to reomove cart.' */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart removed successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/cart/clearCart/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                      #swagger.description = 'Endpoint to reomove cart.' */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart removed successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/cart/increaseQuantity/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                      #swagger.description = 'Endpoint to increase quantity.' */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                           $quantity: ""
                     }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart increased successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/cart/decreaseQuantity/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                      #swagger.description = 'Endpoint to increase quantity.' */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                      $quantity: ""
                   }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart increased successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for address*/
  app.post("/users/address/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to address.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                          $name: "",
                          $email: "",
                          $mobile: "",
                          $dob: "",
                          $gender: "",
                          $area: "",
                          $block: "",
                          $streetName: "",
                          $houseBuilding: "",
                          $appartment: "",
                          $type: ""
                       }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'address added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/address/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to get address list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'address list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/address/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to get address details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'address details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/address/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to update address.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                          $name: "",
                          $email: "",
                          $mobile: "",
                          $dob: "",
                          $gender: "",
                          $area: "",
                          $type: ""
                       }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'address updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/address/setDefault/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to update address.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                          $isDefault: "",
                       }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'address updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/address/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to delete address.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'address deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for order*/
  app.put("/users/order/verifyAccount", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/order/verifyOtpForOrder", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                          $email: ""
                       }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/order/resendOtpForOrder", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/users/order/createOrder", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $address: "",
                            $paymentType: "",
                            $orderType:"",
                            $charge:"",
                            $subTotal:"",
                            $total:"",
                            $promocode:"",
                            $startDate:"",
                            $endDate:"",
                            $branch:"",
                            $asSoonas:""
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/order/myOrder", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['deliveryStatus'] = {
           in: 'query',
           description: 'Enter deliveryStatus.'
          }
     */

    /* #swagger.parameters['deliveryState'] = {
           in: 'query',
           description: 'Enter deliveryState.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/order/orderDetails/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                #swagger.description = 'Endpoint to cancel order.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order cancel successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/order/cancelOrder/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                    #swagger.description = 'Endpoint to cancel order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $deliveryStatus:"",
                            $reason: ""
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'order cancel successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/order/sellerOrderList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['deliveryStatus'] = {
           in: 'query',
           description: 'Enter deliveryStatus.'
          }
     */

    /* #swagger.parameters['type'] = {
           in: 'query',
           description: 'Enter type.'
          }
     */

    /* #swagger.parameters['orderId'] = {
           in: 'query',
           description: 'Enter orderId.'
          }
     */

    /* #swagger.parameters['startDate'] = {
           in: 'query',
           description: 'Enter startDate.'
          }
     */

    /* #swagger.parameters['endDate'] = {
           in: 'query',
           description: 'Enter endDate.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/order/updateOrderState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/order/sellerGraphData", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
              #swagger.description = 'Endpoint to delete Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['dateFilter'] = {
          in: 'query',
          description: 'Enter dateFilter.',
          type: 'string',
          example: 1
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/order/invoiceList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/order/downloadOrderReport/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/order/downloadOrderInvoice/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/order/adminOrderList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['deliveryStatus'] = {
           in: 'query',
           description: 'Enter deliveryStatus.'
          }
     */

    /* #swagger.parameters['startDate'] = {
           in: 'query',
           description: 'Enter startDate.'
          }
     */

    /* #swagger.parameters['endDate'] = {
           in: 'query',
           description: 'Enter endDate.'
          }
     */

    /* #swagger.parameters['companyArr'] = {
           in: 'query',
           description: 'Enter companyArr.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/order/orderDetails/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                #swagger.description = 'Endpoint to cancel order.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order cancel successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/order/updateOrderState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/order/cancelOrder/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                    #swagger.description = 'Endpoint to cancel order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $deliveryStatus:"",
                            $reason: ""
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'order cancel successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/order/invoiceList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/order/downloadOrderReport/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/order/downloadMonthlyReport", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ORDER']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['startDate'] = {
           in: 'query',
           description: 'Enter startDate.'
          }
     */

    /* #swagger.parameters['endDate'] = {
           in: 'query',
           description: 'Enter endDate.'
          }
     */

    /* #swagger.parameters['deliveryStatus'] = {
           in: 'query',
           description: 'Enter deliveryStatus.'
          }
     */

    /* #swagger.parameters['createdByArr'] = {
           in: 'query',
           description: 'Enter createdByArr.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for promotion code*/
  app.post("/admin/promotion/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $country: "",
                            $promoCode: "",
                            $discount: "",
                            $type: "",
                            $categoryId: "",
                            $subcategoryId: "",
                            $company: "",
                            $minPurchaseAmount: "",
                            $maxDiscountAmount: "",
                            $numberOfUsed: "",
                            $numberOfUsedUser: "",
                            $forFreeDelivery: "",
                            $startDate:"",
                            $endDate:""                 
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/promotion/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                    #swagger.description = 'Endpoint to get address list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['stateId'] = {
           in: 'query',
           description: 'Enter stateId.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'address list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/promotion/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $country: "",
                            $promoCode: "",
                            $discount: "",
                            $type: "",
                            $categoryId: "",
                            $subcategoryId: "",
                            $company: "",
                            $minPurchaseAmount: "",
                            $maxDiscountAmount: "",
                            $numberOfUsed: "",
                            $numberOfUsedUser: "",
                            $forFreeDelivery: "",
                            $startDate:"",
                            $endDate:""                   
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/promotion/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PROMOTION_CODE']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/promotion/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                #swagger.description = 'Endpoint to cancel order.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order cancel successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/promotion/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                    #swagger.description = 'Endpoint to delete address.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'address deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/promotion/activeList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                    #swagger.description = 'Endpoint to get address list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'address list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/promotion/applyPromoCode", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                    #swagger.description = 'Endpoint to get address list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $productId: "",
                            $promoId: "",               
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'address list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for banner*/
  app.post("/admin/banner/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BANNER']
                #swagger.description = 'Endpoint to add banner.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
          #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['bannerImg'] = {
        in: 'formData',
        type: 'file',
        required: 'false',
        name:'bannerImg',
        description: 'Add file...',
    }
    
           
               #swagger.parameters['title'] = {
                in: 'formData',
                type: 'string',
                name:'title',
                description: 'Some description...',
          } 
          
           #swagger.parameters['description'] = {
                in: 'formData',
                type: 'string',
                name:'description',
                description: 'Some description...',
          } 

             #swagger.parameters['company'] = {
                in: 'formData',
                type: 'string',
                name:'company',
                description: 'Some description...',
          } 

           #swagger.parameters['productId'] = {
                in: 'formData',
                type: 'string',
                name:'productId',
                description: 'Some description...',
          } 
  
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/banner/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BANNER']
              #swagger.description = 'Endpoint to get all banner list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
           in: 'query',
           description: 'Enter verifyType.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/banner/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BANNER']
              #swagger.description = 'Endpoint to get banner single details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/banner/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BANNER']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['bannerImg'] = {
        in: 'formData',
        type: 'file',
        required: 'false',
        name:'bannerImg',
        description: 'Add file...',
    }
    
           
               #swagger.parameters['title'] = {
                in: 'formData',
                type: 'string',
                name:'title',
                description: 'Some description...',
          } 
          
           #swagger.parameters['description'] = {
                in: 'formData',
                type: 'string',
                name:'description',
                description: 'Some description...',
          } 
          
             #swagger.parameters['company'] = {
                in: 'formData',
                type: 'string',
                name:'company',
                description: 'Some description...',
          } 

           #swagger.parameters['productId'] = {
                in: 'formData',
                type: 'string',
                name:'productId',
                description: 'Some description...',
          } 
  
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/banner/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BANNER']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
           in: 'query',
           description: 'Enter stateId.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/banner/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BANNER']
              #swagger.description = 'Endpoint to get delete single banner ' */

    if (expression) {
      // #swagger.responses[201] = { description: 'product delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/banner/activeBanner", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BANNER']
        #swagger.description = 'Endpoint to get all banner list for users.' */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for review*/
  app.post("/users/review/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['REVIEW']
                #swagger.description = 'Endpoint to add banner.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
          #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['reviewImg'] = {
        in: 'formData',
        type: 'file',
        required: 'false',
        name:'reviewImg',
        description: 'Add file...',
    }
    
           
               #swagger.parameters['review'] = {
                in: 'formData',
                type: 'string',
                name:'review',
                description: 'Some description...',
          } 
          
           #swagger.parameters['rating'] = {
                in: 'formData',
                type: 'number',
                name:'rating',
                description: 'Some rating...',
          } 

           #swagger.parameters['productId'] = {
                in: 'formData',
                type: 'string',
                name:'productId',
                description: 'Some productId...',
          } 
  
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/review/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['REVIEW']
              #swagger.description = 'Endpoint to get delete single banner ' */

    if (expression) {
      // #swagger.responses[201] = { description: 'product delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/review/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['REVIEW']
              #swagger.description = 'Endpoint to get all banner list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['productId'] = {
           in: 'query',
           description: 'Enter productId.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/review/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['REVIEW']
              #swagger.description = 'Endpoint to get all banner list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['productId'] = {
           in: 'query',
           description: 'Enter productId.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/review/review/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['REVIEW']
              #swagger.description = 'Endpoint to get all banner list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['productId'] = {
           in: 'query',
           description: 'Enter productId.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/review/review/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['REVIEW']
              #swagger.description = 'Endpoint to get delete single banner ' */

    if (expression) {
      // #swagger.responses[201] = { description: 'product delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for contact info*/
  app.post("/admin/contactInfo/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACT_INFO']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                                  $countryCode: "",                                  
                                  $mobile: "",
                                  $fbLink: "",
                                  $linkedinLink: "",
                                  $snapChatLink: "",
                                  $instaLink: "",
                                  $address:""
                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/contactInfo/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACT_INFO']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                                  $countryCode: "",                                  
                                  $mobile: "",
                                  $fbLink: "",
                                  $linkedinLink: "",
                                  $snapChatLink: "",
                                  $instaLink: "",
                                  $address:""
                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/contactInfo/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CONTACT_INFO']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/contactInfo/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACT_INFO']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/contactInfo/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BANNER']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
           in: 'query',
           description: 'Enter stateId.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/contactInfo/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACT_INFO']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/contactInfo/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CONTACT_INFO']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for notification*/
  app.get("/users/notification/myNotification", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                           #swagger.description = 'Endpoint to get notification list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'notification list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/notification/deleteNotification", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['NOTIFICATION']
                      #swagger.description = 'Endpoint to delete.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'notification delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/notification/sendNotification", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['NOTIFICATION']
                #swagger.description = 'Endpoint to add banner.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
          #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['image'] = {
        in: 'formData',
        type: 'file',
        required: 'false',
        name:'image',
        description: 'Add file...',
    }
    
           
               #swagger.parameters['title'] = {
                in: 'formData',
                type: 'string',
                name:'title',
                description: 'Some title...',
          } 
          
           #swagger.parameters['arabicTitle'] = {
                in: 'formData',
                type: 'number',
                name:'arabicTitle',
                description: 'Some arabicTitle...',
          } 

           #swagger.parameters['description'] = {
                in: 'formData',
                type: 'string',
                name:'description',
                description: 'Some description...',
          } 

             #swagger.parameters['arabicDescription'] = {
                in: 'formData',
                type: 'string',
                name:'arabicDescription',
                description: 'Some arabicDescription...',
          } 

            #swagger.parameters['userId'] = {
                in: 'formData',
                type: 'string',
                name:'userId',
                description: 'Some userId...',
          } 

             #swagger.parameters['company'] = {
                in: 'formData',
                type: 'string',
                name:'company',
                description: 'Some company...',
          } 

            #swagger.parameters['type'] = {
                in: 'formData',
                type: 'string',
                name:'type',
                description: 'Some company...',
          } 

            #swagger.parameters['notificationType'] = {
                in: 'formData',
                type: 'string',
                name:'notificationType',
                description: 'Some company...',
          } 
  
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/notification/getAdminNotificationList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                           #swagger.description = 'Endpoint to get notification list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'notification list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/notification/notificationView/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                           #swagger.description = 'Endpoint to get notification list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'notification list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for schedule order*/
  app.get("/users/scheduleOrder/slotList/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SCHEDULE_ORDER']
                           #swagger.description = 'Endpoint to get notification list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['day'] = {
                         in: 'query',
                         description: 'Enter day.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'notification list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.post("/users/scheduleOrder/scheduleOrder", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SCHEDULE_ORDER']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $day: "",
                                  $time: "",                                  
                                  $orderId: ""
                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for dynamic question*/
  app.post("/admin/dynamic/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DYNAMIC_QUESTION']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $question: "",
                                  $answerType: "",                                  
                                  $isMandatory: "",
                                  $features:"",
                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/dynamic/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DYNAMIC_QUESTION']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $question: "",
                                  $answerType: "",                                  
                                  $isMandatory: "",
                                  $features:"",
                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/dynamic/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DYNAMIC_QUESTION']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                       in: 'query',
                       description: 'Enter pageNo.'
                      }
                 */

    /* #swagger.parameters['pageLimit'] = {
                       in: 'query',
                       description: 'Enter pageLimit.'
                      }
                 */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/dynamic/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DYNAMIC_QUESTION']
                         #swagger.description = 'Endpoint to get transaction details.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/dynamic/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DYNAMIC_QUESTION']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
           in: 'query',
           description: 'Enter stateId.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/dynamic/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DYNAMIC_QUESTION']
           #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/dynamic/assignQuestion/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DYNAMIC_QUESTION']
                         #swagger.description = 'Endpoint to get transaction details.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['productId'] = {
                       in: 'query',
                       description: 'Enter productId.'
                      }
                 */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.post("/users/dynamic/submitAnswer", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DYNAMIC_QUESTION']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $answers: "[{questionId:questionId,answerId:answerId}]",

                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for classification*/
  app.post("/admin/classification/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CLLASIFICATION']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $name: "",
                                  $arbicName: "",                                  
                                  $order: ""
                                                    
                          }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/classification/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CLLASIFICATION']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $name: "",
                                  $arbicName: "",                                  
                                  $order: ""
                                                    
                          }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/classification/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CLLASIFICATION']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                       in: 'query',
                       description: 'Enter search.'
                      }
                 */

    /* #swagger.parameters['stateId'] = {
                       in: 'query',
                       description: 'Enter stateId.'
                      }
                 */

    /* #swagger.parameters['pageNo'] = {
                       in: 'query',
                       description: 'Enter pageNo.'
                      }
                 */

    /* #swagger.parameters['pageLimit'] = {
                       in: 'query',
                       description: 'Enter pageLimit.'
                      }
                 */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/classification/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CLLASIFICATION']
                         #swagger.description = 'Endpoint to get transaction details.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/classification/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CLLASIFICATION']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
           in: 'query',
           description: 'Enter stateId.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'banner updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/classification/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CLLASIFICATION']
           #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/classification/dropDown", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CLLASIFICATION']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                       in: 'query',
                       description: 'Enter pageNo.'
                      }
                 */

    /* #swagger.parameters['pageLimit'] = {
                       in: 'query',
                       description: 'Enter pageLimit.'
                      }
                 */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/classification/companyClassification/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CLLASIFICATION']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/classification/activeClassification", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CLLASIFICATION']
              #swagger.description = 'Endpoint to get saved search list.' 
                  */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for coupon*/
  app.get("/users/coupon/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COUPON']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                       in: 'query',
                       description: 'Enter search.'
                      }
                 */

    /* #swagger.parameters['pageNo'] = {
                       in: 'query',
                       description: 'Enter pageNo.'
                      }
                 */

    /* #swagger.parameters['pageLimit'] = {
                       in: 'query',
                       description: 'Enter pageLimit.'
                      }
                 */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/coupon/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COUPON']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/coupon/manuallyAddCode", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COUPON']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['couponCode'] = {
                       in: 'query',
                       description: 'Enter couponCode.'
                      }
                 */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/coupon/scanCoupon/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COUPON']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/coupon/downloadCouponReport", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['COUPON']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for permission*/
  app.post("/admin/permission/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PERMISSION']
              #swagger.description = 'Endpoint to assign permission.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $roleId: "",
                        $sellerId: "",
                        $isProductManagementAccess: "",
                        $isOrderManagementAccess: "",
                        $isCouponManagementAccess:"",
                        $isRatingManagementAccess:"",
                        $productManagement: {
                          $add: "",
                          $edit: "",
                          $delete: "",
                          $view: "",
                          $all: "",
                        },
                        $orderManagement: {
                          $add: "",
                          $edit: "",
                          $delete: "",
                          $view: "",
                          $all: "",
                        },
                        $couponManagement: {
                          $add: "",
                          $edit: "",
                          $delete: "",
                          $view: "",
                          $all: "",
                        },
                        $ratingManagement: {
                          $add: "",
                          $edit: "",
                          $delete: "",
                          $view: "",
                          $all: "",
                        }
                     }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'permission assigned successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/role/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PERMISSION']
              #swagger.description = 'Endpoint to assign permission.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $roleId: "",
                        $sellerId: "",
                        $isProductManagementAccess: "",
                        $isOrderManagementAccess: "",
                        $isCouponManagementAccess:"",
                        $isRatingManagementAccess:"",
                        $productManagement: {
                          $add: "",
                          $edit: "",
                          $delete: "",
                          $view: "",
                          $all: "",
                        },
                        $orderManagement: {
                          $add: "",
                          $edit: "",
                          $delete: "",
                          $view: "",
                          $all: "",
                        },
                        $couponManagement: {
                          $add: "",
                          $edit: "",
                          $delete: "",
                          $view: "",
                          $all: "",
                        },
                        $ratingManagement: {
                          $add: "",
                          $edit: "",
                          $delete: "",
                          $view: "",
                          $all: "",
                        }
                     }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'permission assigned successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/role/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PERMISSION']
                        #swagger.description = 'Endpoint to get faqs list' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['search'] = {
         in: 'query',
         description: 'Enter search.'
        }
   */

    /* #swagger.parameters['pageNo'] = {
                     in: 'query',
                     description: 'Enter pageNo.'
                    }
               */

    /* #swagger.parameters['pageLimit'] = {
                     in: 'query',
                     description: 'Enter pageLimit.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQs list found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/role/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PERMISSION']
                        #swagger.description = 'Endpoint to get faqs list' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQs list found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/role/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PERMISSION']
                        #swagger.description = 'Endpoint to get faqs list' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['stateId'] = {
                     in: 'query',
                     description: 'Enter stateId.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQs list found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for offer*/
  app.post("/admin/offer/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['OFFER']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
        #swagger.consumes = ['multipart/form-data']  
           #swagger.parameters['image'] = {
               in: 'formData',
               type: 'file',
               description: 'image',
           } 

           #swagger.parameters['title'] = {
               in: 'formData',
               type: 'string',
               description: 'Enter title',
               value:"Food"
           } 

              #swagger.parameters['discount'] = {
               in: 'formData',
               type: 'number',
               description: 'discount',
           }

          */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/offer/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['OFFER']
                                   #swagger.description = 'Endpoint to get login history.' 
                            */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
                                 in: 'query',
                                 description: 'Enter stateId.',
                                 type:'number',
                                 value:1
                                }
                           */

    /* #swagger.parameters['pageNo'] = {
                                 in: 'query',
                                 description: 'Enter pageNo.',
                                 type:'number',
                                 value:1
                                }
                           */

    /* #swagger.parameters['pageLimit'] = {
                                 in: 'query',
                                 description: 'Enter pageLimit.',
                                 type:'number',
                                 value:10
                                }
                           */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/offer/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['OFFER']
          #swagger.description = 'Endpoint to view contactus details.'
   */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/offer/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['OFFER']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Enter id.',
        type: 'string',
        example: "66e7cf0759160948ff3f1b90"  
  } */

    /*
        #swagger.consumes = ['multipart/form-data']  
           #swagger.parameters['image'] = {
               in: 'formData',
               type: 'file',
               description: 'image',
           } 

           #swagger.parameters['title'] = {
               in: 'formData',
               type: 'string',
               description: 'Enter title',
               value:"Food"

           } 

          #swagger.parameters['discount'] = {
               in: 'formData',
               type: 'number',
               description: 'discount',
           }

          */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/offer/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['OFFER']
                    #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Enter id.',
        type: 'string',
        example: "66e7cf0759160948ff3f1b90"  
  } */

    /* #swagger.parameters['stateId'] = {
                         in: 'query',
                         description: 'Enter stateId.',
                         type: 'number',
                         value:1
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/offer/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['OFFER']
              #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: 'Enter id.',
        type: 'string',
        example: "66e7cf0759160948ff3f1b90"  
  } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/offer/activeOfferList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['OFFER']
        #swagger.description = 'Endpoint to get login history.' 
  */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for refund request*/
  app.get("/admin/refundRequest/requestList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['REFUND_REQUEST']
                        #swagger.description = 'Endpoint to get faqs list' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                     in: 'query',
                     description: 'Enter pageNo.'
                    }
               */

    /* #swagger.parameters['pageLimit'] = {
                     in: 'query',
                     description: 'Enter pageLimit.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQs list found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/refundRequest/updateRequest/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['REFUND_REQUEST']
                    #swagger.description = 'Endpoint to change faq state.' 
   */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
                         in: 'query',
                         description: 'Enter stateId.',
                         type: 'number',
                         value:1
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for payment*/
  app.post("/users/payment/charge", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PAYMENT']
              #swagger.description = 'Endpoint to assign permission.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $amount: ""
                     }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'permission assigned successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/users/payment/createAppCharge", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PAYMENT']
              #swagger.description = 'Endpoint to assign permission.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $amount: "",
                        $sourceId:""
                     }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'permission assigned successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/payment/transactionGraph", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get saved search list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/payment/transactionList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get saved search list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/payment/transactionView/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get transaction details.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/payment/myTransaction", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get saved search list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/payment/transactionView/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get transaction details.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/payment/refund/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get transaction details.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/payment/transaction/refund/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get transaction details.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/payment/downloadRefundReport", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['startDate'] = {
           in: 'query',
           description: 'Enter startDate.'
          }
     */

    /* #swagger.parameters['endDate'] = {
           in: 'query',
           description: 'Enter endDate.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/payment/itemRefund", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get transaction details.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $orderId: "",
                        $productId: "",
                        $amount:""
                     }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/payment/myRefundList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get saved search list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/payment/cardList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get saved search list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/payment/deleteCard/:cardId", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get transaction details.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.post("/users/payment/sellerAddRefund", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                           #swagger.description = 'Endpoint to get transaction details.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $orderId: "",
                        $productId: "",
                        $amount:""
                     }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for statement acccount*/
  app.post("/admin/statementAccount/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STATEMENT_ACCOUNT']
              #swagger.description = 'Endpoint to assign permission.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $flexiblePrice: "false",
                        $accountantName: "",
                        $accountantTelephone: "",
                        $chequeCompany:"",
                        $linkTelephoneNumber:"",
                        $bankName:"",
                        $accountNumber:"",
                        $bankCode:"",
                        $branchName:"",
                        $swiftCode:"",
                        $IBAN:"",
                        $AccountType:"",
                        $paymentMethod:""
                     }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'permission assigned successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/statementAccount/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['STATEMENT_ACCOUNT']
                           #swagger.description = 'Endpoint to get saved search list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                         in: 'query',
                         description: 'Enter search.'
                        }
                   */

    /* #swagger.parameters['stateId'] = {
                         in: 'query',
                         description: 'Enter stateId.'
                        }
                   */

    /* #swagger.parameters['accountType'] = {
                         in: 'query',
                         description: 'Enter accountType.'
                        }
                   */

    /* #swagger.parameters['paymentMethod'] = {
                         in: 'query',
                         description: 'Enter paymentMethod.'
                        }
                   */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/statementAccount/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['STATEMENT_ACCOUNT']
                           #swagger.description = 'Endpoint to get transaction details.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/statementAccount/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STATEMENT_ACCOUNT']
              #swagger.description = 'Endpoint to assign permission.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $flexiblePrice: "false",
                        $accountantName: "",
                        $accountantTelephone: "",
                        $chequeCompany:"",
                        $linkTelephoneNumber:"",
                        $bankName:"",
                        $accountNumber:"",
                        $bankCode:"",
                        $branchName:"",
                        $swiftCode:"",
                        $IBAN:"",
                        $AccountType:"",
                        $paymentMethod:""
                     }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'permission assigned successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/statementAccount/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['STATEMENT_ACCOUNT']
                           #swagger.description = 'Endpoint to get transaction details.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/statementAccount/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['STATEMENT_ACCOUNT']
                    #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
                         in: 'query',
                         description: 'Enter stateId.',
                         type: 'number',
                         value:1
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/statementAccount/statementTransaction", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['STATEMENT_ACCOUNT']
                           #swagger.description = 'Endpoint to get saved search list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['company'] = {
                         in: 'query',
                         description: 'Enter company.'
                        }
                   */

    /* #swagger.parameters['accountType'] = {
                         in: 'query',
                         description: 'Enter accountType.'
                        }
                   */

    /* #swagger.parameters['startDate'] = {
                         in: 'query',
                         description: 'Enter startDate.'
                        }
                   */

    /* #swagger.parameters['endDate'] = {
                         in: 'query',
                         description: 'Enter endDate.'
                        }
                   */

    /* #swagger.parameters['percentage'] = {
                         in: 'query',
                         description: 'Enter percentage.'
                        }
                   */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.put(
    "/admin/statementAccount/updateStatementTransaction/:id",
    (req, res) => {
      res.setHeader("Content-Type", "application/xml");

      /*  #swagger.tags = ['STATEMENT_ACCOUNT']
                           #swagger.description = 'Endpoint to get saved search list.' 
                    */
      /* #swagger.security = [{ "Bearer": [] }] */

      /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $type:"",
                        $amountCr: "",
                        $balance: "",
                        $amountDr: ""
                     }
         } */

      if (expression) {
        // #swagger.responses[201] = { description: 'saved search list found successfully.' }
        return res.status(200).send(data);
      }
      return res.status(500);
    }
  );
  app.post("/admin/statementAccount/statementTransaction/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STATEMENT_ACCOUNT']
              #swagger.description = 'Endpoint to assign permission.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $type: "",
                        $number: "",
                        $paymentType: "",
                        $amountDr:"",
                        $amountCr:"",
                        $balance:"",
                        $company:""
                      }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'permission assigned successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get(
    "/admin/statementAccount/viewStatementTransaction/:id",
    (req, res) => {
      res.setHeader("Content-Type", "application/xml");

      /*  #swagger.tags = ['STATEMENT_ACCOUNT']
                           #swagger.description = 'Endpoint to get transaction details.' 
                    */
      /* #swagger.security = [{ "Bearer": [] }] */

      if (expression) {
        // #swagger.responses[201] = { description: 'transaction details found successfully.' }
        return res.status(200).send(data);
      }
      return res.status(500);
    }
  );
  app.get("/admin/statementAccount/downloadStatementReport", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['STATEMENT_ACCOUNT']
                           #swagger.description = 'Endpoint to get saved search list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['company'] = {
                         in: 'query',
                         description: 'Enter company.'
                        }
                   */

    /* #swagger.parameters['accountType'] = {
                         in: 'query',
                         description: 'Enter accountType.'
                        }
                   */

    /* #swagger.parameters['startDate'] = {
                         in: 'query',
                         description: 'Enter startDate.'
                        }
                   */

    /* #swagger.parameters['endDate'] = {
                         in: 'query',
                         description: 'Enter endDate.'
                        }
                   */

    /* #swagger.parameters['percentage'] = {
                         in: 'query',
                         description: 'Enter percentage.'
                        }
                   */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for spinner*/
  app.post("/admin/spinner/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['spinnerImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'spinnerImg',
             } 
  
             
        #swagger.parameters['spinType'] = {
            in: 'formData',
            type: 'number',
            description: 'Type of spin',

        }


        #swagger.parameters['startDate'] = {
            in: 'formData',
            type: 'string',
            description: 'Start date of the spinner',

        }


        #swagger.parameters['endDate'] = {
            in: 'formData',
            type: 'string',
            description: 'End date of the spinner',

        }


        #swagger.parameters['speed'] = {
            in: 'formData',
            type: 'number',
            description: 'Speed of the spinner',
            minimum: 0

        }


        #swagger.parameters['size'] = {
            in: 'formData',
            type: 'string',
            description: 'Size of the spinner',

        }


        #swagger.parameters['value'] = {
            in: 'formData',
            type: 'string',
            description: 'Value of the spinner',

        }


        #swagger.parameters['minAmount'] = {
            in: 'formData',
            type: 'number',
            description: 'Minimum amount for the spinner',

        }


        #swagger.parameters['maxCashBack'] = {
            in: 'formData',
            type: 'number',
            description: 'Maximum cashback for the spinner',

        }


        #swagger.parameters['category'] = {
            in: 'formData',
            type: 'string',
            description: 'Category ID for the spinner',

        }


        #swagger.parameters['company'] = {
            in: 'formData',
            type: 'string',
            description: 'Company ID for the spinner',
        }


        #swagger.parameters['stateId'] = {
            in: 'formData',
            type: 'number',
            description: 'State of the spinner',
        }
            */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/spinner/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SPINNER']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:"Food"
                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/spinner/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
            #swagger.description = 'Endpoint to view contactus details.'
     */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/spinner/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['spinnerImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'spinnerImg',
             } 
  
             #swagger.parameters['spinner'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter spinner',
                 value:"Food"

             } 

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/spinner/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SPINNER']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/spinner/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/spinner/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SPINNER']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/spinner/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
            #swagger.description = 'Endpoint to view contactus details.'
     */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/users/spinner/win", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
              #swagger.description = 'Endpoint to assign permission.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $spinnerId : ''
                      }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'permission assigned successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/spinner/win/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SPINNER']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */
    /* #swagger.parameters['type'] = {
                                 in: 'query',
                                 description: 'Enter type.',
                                 type:'string',
                                 value:10
                                }
                           */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/spinner/downloadSpinnerReport", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SPINNER']
                         #swagger.description = 'Endpoint to get saved search list.' 
                  */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['startDate'] = {
                           in: 'query',
                           description: 'Enter startDate.',
                           type: 'string'
                          }
                     */

    /* #swagger.parameters['endDate'] = {
                           in: 'query',
                           description: 'Enter endDate.',
                           type: 'string'
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  app.post("/spinner/win", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
              #swagger.description = 'Endpoint to assign permission.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $spinnerId : '',
                        $deviceToken : '',                      }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'permission assigned successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/spinner/win/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SPINNER']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */
    /* #swagger.parameters['type'] = {
                                 in: 'query',
                                 description: 'Enter type.',
                                 type:'string',
                                 value:10
                                }
                           */
    /* #swagger.parameters['deviceToken'] = {
                                 in: 'query',
                                 description: 'Enter deviceToken.',
                                 type:'string',
                                 value:"sdf23432sfd23r"
                                }
                           */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for spinner*/
  app.post("/admin/spinner/setting/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $description : '',
                        $startDate : '',
                        $endDate : '',
                        $userUserPerDay : '',
                        $showPerUserDay : ''
                                                
                      }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/spinner/setting/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SPINNER']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:"Food"
                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/spinner/setting/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
            #swagger.description = 'Endpoint to view contactus details.'
     */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/spinner/setting/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $description : '',
                        $startDate : '',
                        $endDate : '',
                        $userUserPerDay : '',
                        $showPerUserDay : '',
                                                
                      }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/spinner/setting/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SPINNER']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/spinner/setting/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SPINNER']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for spinner*/
  app.get("/users/cashback/myCashBack", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CASHBACK']
           #swagger.description = 'Endpoint to get csm list.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                               in: 'query',
                               description: 'Enter pageNo.',
                               type: 'number',
                               value:1
                              }
                         */

    /* #swagger.parameters['pageLimit'] = {
                               in: 'query',
                               description: 'Enter pageLimit.',
                               type: 'number',
                               value:10
                              }
                         */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  app.post("/admin/dynamicLabeling/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DYNAMIC_LABELING']
               #swagger.description = 'Endpoint to add dynamic labeling.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $title : '',
                        $arabicTitle : '',
                        $company : ''
                                                
                      }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'dynamic labeling added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/dynamicLabeling/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DYNAMIC_LABELING']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                                   in: 'query',
                                   description: 'Enter search.',
                                   type:'string',
                                   value:"Food"
                                  }
                             */

    /* #swagger.parameters['stateId'] = {
                                   in: 'query',
                                   description: 'Enter stateId.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageNo'] = {
                                   in: 'query',
                                   description: 'Enter pageNo.',
                                   type:'number',
                                   value:1
                                  }
                             */

    /* #swagger.parameters['pageLimit'] = {
                                   in: 'query',
                                   description: 'Enter pageLimit.',
                                   type:'number',
                                   value:10
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/dynamicLabeling/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DYNAMIC_LABELING']
            #swagger.description = 'Endpoint to view contactus details.'
     */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/dynamicLabeling/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DYNAMIC_LABELING']
               #swagger.description = 'Endpoint to add dynamic labeling.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                 in: 'body',
                 title: 'Some description...',
                 schema: {
                        $title : '',
                        $arabicTitle : '',
                        $company : ''
                                                
                      }
         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'dynamic labeling added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/dynamicLabeling/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DYNAMIC_LABELING']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/dynamicLabeling/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DYNAMIC_LABELING']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/dynamicLabeling/activeLabeling", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DYNAMIC_LABELING']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/dynamicLabeling/activeLabeling", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DYNAMIC_LABELING']
                   #swagger.description = 'Endpoint to get login history.' 
                              */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/users/dynamicLabeling/allLabeling", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DYNAMIC_LABELING']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['title'] = {
                                   in: 'query',
                                   description: 'Enter title.',
                                   type:'string',
                                   value:"Best seller"
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/dynamicLabeling/allLabeling", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DYNAMIC_LABELING']
                                     #swagger.description = 'Endpoint to get login history.' 
                              */

    /* #swagger.parameters['title'] = {
                                   in: 'query',
                                   description: 'Enter title.',
                                   type:'string',
                                   value:"Best seller"
                                  }
                             */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for twillio*/
  app.post("/admin/twillio/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['Twillio']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $twillioAccountSid: "",
                                  $twillioAuthToken: "",                                  
                                  $twillioWhatAppNumber: "",
                                  $twillioSeriveId:"", 
                                  $twillioPhoneNumber:"", 
                                  $twillioContentSid:"",           
                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/twillio/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Twillio']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/twillio/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['Twillio']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/twillio/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['Twillio']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/twillio/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['Twillio']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $twillioAccountSid: "",
                                  $twillioAuthToken: "",                                  
                                  $twillioWhatAppNumber: "",
                                  $twillioSeriveId:"", 
                                  $twillioPhoneNumber:"", 
                                  $twillioContentSid:"",           
                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for governate*/
  app.get("/governate/governateList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['GOVERNATE']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/governate/governateAreaList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['GOVERNATE']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */

    /* #swagger.parameters['governateId'] = {
                         in: 'query',
                         description: 'Enter governateId.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Get sms-List*/
  app.get("/admin/smsLogs/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMS_LOGS']
                            #swagger.description = 'Endpoint to get Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    /* #swagger.parameters['search'] = {
                         in: 'query',
                         description: 'Enter search.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/smsLogs/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMS_LOGS']
                            #swagger.description = 'Endpoint to delete Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/smsLogs/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMS_LOGS']
                            #swagger.description = 'Endpoint to delete Error logs' */
    /* #swagger.security = [{ "Bearer": [] }] */
    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/smsLogs/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMS_LOGS']
                      #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Email delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*App version routes*/
  app.post("/admin/appversion/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['APP_VERSION']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $platform: "",
                                  $latestVersion: "",                                  
                                  $forceUpdate: "",
                                  $releaseNotes:""       
                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/appversion/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['APP_VERSION']
                            #swagger.description = 'Endpoint to get APP version' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/appversion/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['APP_VERSION']
                            #swagger.description = 'Endpoint to delete Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/appversion/versionList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['APP_VERSION']
                            #swagger.description = 'Endpoint to get APP version' */

    /* #swagger.parameters['platform'] = {
                         in: 'query',
                         description: 'Enter platform.'
                        }
                   */

    /* #swagger.parameters['type'] = {
                         in: 'query',
                         description: 'Enter type.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/appversion/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['APP_VERSION']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $platform: "",
                                  $latestVersion: "",                                  
                                  $forceUpdate: "",
                                  $releaseNotes:""       
                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/appversion/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['APP_VERSION']
                      #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Email delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
};
