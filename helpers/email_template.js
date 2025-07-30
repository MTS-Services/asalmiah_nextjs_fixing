/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let dotenv = require("dotenv");
dotenv.config();
const moment = require("moment");
const { formatNumber } = require("../middleware/commonFunction");
const todayDate = new Date();

module.exports = {
  ACCOUNT_VERIFICATION_TEMPLATE(username, otp) {
    return `<!DOCTYPE html>
    <html>
    
    <head>
       <title>Welcome</title>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    
       <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
    
          body {
             font-family: 'Roboto', sans-serif;
          }
       </style>
    </head>
    
    <body style="background-color:#E6EEF2;color: #202020;padding: 50px 15px;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;">
       <br>
       <table style="max-width: 600px; background: #fff; margin: 0 auto; padding: 15px; height: 100%;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);">
        <tbody><tr>
            <td>
       <table style=" padding:10px 0px 30px 0px ; width: 100%;background:#f7f7f7; border-spacing: 0;  font-family: 'Roboto', sans-serif;">
          <tr>
              <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><b style="color: #da2a2c; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT </b></td>
                      <td style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right;">
                       ${moment(todayDate).format("DD-MMM-YYYY").toUpperCase()}
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
    
    <tr>
       <td style="padding: 30px 28px 0px; ">
          <table style="width: 100%;">
             <tr>
                <td>
                   <h2 style="margin: 0;">Hi, ${username ? username : "User"}
                   </h2>
                </td>
             </tr>
             <tr>
                <td style="padding-top: 15px; ">
                   <span style="margin: 0; font-weight: 400; font-size: 21px;">
                      Welcome to <b style="color: #da2a2c;">Offarat </b>
                   </span>
    
                </td>
             </tr>
    
             <tr>
                <td>
                   <p> Thanks for
          signing up. To continue, please confirm your otp by entering it
                   </p>
                  <h3 style="text-align: center">OTP <span style="font-size:16px; font-weight:400;">is</span>  <span style="font-size:16px; font-weight:400;">${otp}</span> </h3>
    
            <p >
         
        </p>
                </td>
             </tr>
          </table>
       </td>
    </tr>
    
    
    
    <tr>
       <td style="padding: 12px 20px; ">
          <table style="background-color: #da2a2c; width: 100%;">
    
             <tr>
                <td style="padding: 15px 15px; color: #fff;" align="center">
                   <span style="margin: 0; font-weight: 400; font-size: 20px;">
                      Thank you for joining the <b>Offarat </b> 
                   </span>
    
                </td>
             </tr>
    
          </table>
       </td>
    </tr>
    
    
     <!--body end-->
      
     <tr>
      <td>
        <table style=" width: 100%; padding-top: 20px;">
    
          <tr>
            <td align="center" style="padding-top: 20px">
              <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                <tbody>
                  <tr>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-14.665479,-157.42976)">
                            <g id="g16"
                              transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                              <g id="g14">
                                <circle id="circle10" data-original="#3B5998" r="56.098"
                                  cy="56.098" cx="56.098" style="fill:#3b5998" />
                                <path id="path12" className="active-path" data-original="#FFFFFF"
                                  d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                  style="fill:#ffffff" inkscape:connector-curvature="0" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                          <defs id="defs67" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata70">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-13.154175,-149.114)">
                            <g id="g83"
                              transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                              <g id="g81">
                                <circle id="circle75" className="" data-original="#55ACEE"
                                  r="56.098" cy="56.098" cx="56.098999"
                                  style="fill:#55acee" />
                                <g id="g79">
                                  <path id="path77" className="active-path"
                                    data-original="#F1F2F2"
                                    d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                    style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)"
                          sodipodi:docname="youtube-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-26.760715,-164.98928)">
                            <g id="g18"
                              transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                              <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                cx="256" style="fill:#d22215" />
                              <path id="path12" data-original="#A81411"
                                d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                style="fill:#a81411" inkscape:connector-curvature="0" />
                              <path id="path14" data-original="#FFFFFF"
                                d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                style="fill:#ffffff" inkscape:connector-curvature="0" />
                              <path id="path16" className="active-path" data-original="#D1D1D1"
                                d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                            </g>
                          </g>
                        </svg>
                      </p></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
              <span style="margin: 0; font-weight: 400; font-size: 13px;">
                Copyright 2024 <b>Offarat</b>
              </span>
            </td>
          </tr>
    
    
    
    
        </table>
      </td>
    </tr>
    
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
    </body>
    
    </html>`;
  },

  WELCOME_EMAIL_TEMPLATE(name, email, countryCode, mobile) {
    return `<!DOCTYPE html>
    <html>
    
    <head>
       <title>Welcome</title>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

       <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
    
          body {
             font-family: 'Roboto', sans-serif;
          }
       </style>
    </head>
    
    <body style="background-color:#E6EEF2;color: #202020;padding: 50px 15px;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;">
       <br>
       <table style="max-width: 600px; background: #fff; margin: 0 auto; padding: 15px; height: 100%;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);">
        <tbody><tr>
            <td>
       <table style=" padding:10px 0px 30px 0px ; width: 100%;background:#f7f7f7; border-spacing: 0;  font-family: 'Roboto', sans-serif;">
          <tr>
               <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><b style="color: #da2a2c; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT </b></td>
                      <td style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right;">
                       ${moment(todayDate).format("DD-MMM-YYYY").toUpperCase()}
                      </td>
                   </tr>
                </table>
             </td>
             </td>
          </tr>
    
      <!--- body start-->
      <tr>
             <td style="background-color:  #da2a2c; " align="center">
                <table style="width: 100%; margin: 0 auto; ">
    
                   <tr>
                      <td style="width: 100%; text-align: center; padding-top: 15px; padding-bottom:15px;" colspan="2">
                         <h1
                            style="letter-spacing: 0.5px;color: #ffffff;line-height: 1.3; text-transform: uppercase; margin: 0;">
                            Warm Greetings ! !
                         </h1>
                      </td>
    
                   </tr>
                
                </table>
    
             </td>
          </tr>
      
          <tr>
             <td style="padding: 30px 28px; ">
                <table style="width: 100%;">
                   <tr>
                      <td>
                         <h2 style="margin: 0;">Hi, ${name ? name : "User"}</h2>
                      </td>
                   </tr>
                   <tr>
                      <td style="padding-top: 15px; ">
                         <span style="margin: 0; font-weight: 400; font-size: 21px;">
                            Welcome to <b style="color: #FF0000;">Offarat</b>
                         </span>
    
                      </td>
                   </tr>
                   <tr>
                      <td style="padding-top: 15px; ">
                         <span style="margin: 0; font-weight: 400; font-size: 21px;">
                            Email : <b>${email}</b>
                         </span>
                         
    
                      </td>
                       </tr>
                       <tr>
                         <td style="padding-top: 15px; ">
                       <span style="margin: 0; font-weight: 400; font-size: 21px;">
                            Phone Number : <b>${countryCode + " " + mobile}</b>
                         </span>
                           </td>
                   </tr>
                   <tr>
                      <td style="padding-top: 0; color: #3c3c3c;">
                         <span style="margin: 0; font-weight: 400; font-size: 16px;">
                         </span>
    
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
      
          <tr>
             <td style="padding: 12px 20px; ">
                <table style="background-color:  #da2a2c; width: 100%;">
    
                   <tr>
                      <td style="padding: 15px 15px; color: #fff;" align="center">
                         <span style="margin: 0; font-weight: 400; font-size: 20px;">
                            Thank you for joining the <b>Offarat</b>
                         </span>
    
                      </td>
                   </tr>
    
                </table>
             </td>
          </tr>
      <!--body end-->
      
      <tr>
      <td>
        <table style=" width: 100%; padding-top: 20px;">
    
          <tr>
            <td align="center" style="padding-top: 20px">
              <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                <tbody>
                  <tr>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">I
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-14.665479,-157.42976)">
                            <g id="g16"
                              transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                              <g id="g14">
                                <circle id="circle10" data-original="#3B5998" r="56.098"
                                  cy="56.098" cx="56.098" style="fill:#3b5998" />
                                <path id="path12" className="active-path" data-original="#FFFFFF"
                                  d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                  style="fill:#ffffff" inkscape:connector-curvature="0" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                          <defs id="defs67" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata70">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-13.154175,-149.114)">
                            <g id="g83"
                              transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                              <g id="g81">
                                <circle id="circle75" className="" data-original="#55ACEE"
                                  r="56.098" cy="56.098" cx="56.098999"
                                  style="fill:#55acee" />
                                <g id="g79">
                                  <path id="path77" className="active-path"
                                    data-original="#F1F2F2"
                                    d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                    style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)"
                          sodipodi:docname="youtube-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-26.760715,-164.98928)">
                            <g id="g18"
                              transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                              <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                cx="256" style="fill:#d22215" />
                              <path id="path12" data-original="#A81411"
                                d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                style="fill:#a81411" inkscape:connector-curvature="0" />
                              <path id="path14" data-original="#FFFFFF"
                                d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                style="fill:#ffffff" inkscape:connector-curvature="0" />
                              <path id="path16" className="active-path" data-original="#D1D1D1"
                                d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                            </g>
                          </g>
                        </svg>
                      </p></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
              <span style="margin: 0; font-weight: 400; font-size: 13px;">
                Copyright 2024 <b>Offarat</b>
              </span>
            </td>
          </tr>
    
    
    
    
        </table>
      </td>
    </tr>
    
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
    </body>
    
    </html>`;
  },

  WELCOME_NOTIFY_EMAIL_TEMPLATE_FOR_ADMIN(
    username,
    email,
    countryCode,
    mobile
  ) {
    return `<!DOCTYPE html>
    <html>
      <head>
        <title>Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap");
    
          body {
            font-family: "Roboto", sans-serif;
          }
        </style>
      </head>
    
      <body
        style="
          background-color: #e6eef2;
          color: #202020;
          padding: 50px 15px;
          font-size: 15px;
          line-height: 24px;
          font-family: 'Roboto', sans-serif;
        "
      >
        <br />
        <table
          style="
            width: 600px;
            background: #fff;
            margin: 0 auto;
            padding: 15px;
            height: 100%;
            box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);
          "
        >
          <tbody>
            <tr>
              <td>
                <table
                  style="
                    padding: 10px 0px 30px 0px;
                    width: 100%;
                    background: #f7f7f7;
                    border-spacing: 0;
                    font-family: 'Roboto', sans-serif;
                  "
                >
                  <tr>
                     <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><b style="color: #da2a2c; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT </b></td>
                      <td style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right;">
                       ${moment(todayDate).format("DD-MMM-YYYY").toUpperCase()}
                      </td>
                   </tr>
                </table>
             </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
    
                  <!--- body start-->
                  <tr>
                    <td style="background-color: #da2a2c" align="center">
                      <table style="width: 100%; margin: 0 auto">
                        <tr>
                          <td
                            style="
                              width: 100%;
                              text-align: center;
                              padding-top: 15px;
                              padding-bottom: 15px;
                            "
                            colspan="2"
                          >
                            <h1
                              style="
                                letter-spacing: 0.5px;
                                color: #ffffff;
                                line-height: 1.3;
                                text-transform: uppercase;
                                margin: 0;
                              "
                            >
                            New User is Register ! !
                            </h1>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
    
                  <tr>
                    <td style="padding: 30px 28px">
                      <table style="width: 100%">
                        
                        <tr>
                          <td style="padding-top: 15px">
                        
                          </td>
                        </tr>
                        <tr>
                        
                          <td style="padding-top: 0; color: #3c3c3c">
                          <br>
                          <span
                              style="margin: 0; font-weight: 400; font-size: 21px"
                            >
                               </span>
                               <h6>Name <span style="font-size:16px; font-weight:400;">:</span>  <span style="font-size:16px; font-weight:400;"> ${username}</span> </h6>
                               <h6>Email <span style="font-size:16px; font-weight:400;">:</span>  <span style="font-size:16px; font-weight:400;"> ${email}</span> </h6>
                               <h6>PhoneNumber <span style="font-size:16px; font-weight:400;">:</span>  <span style="font-size:16px; font-weight:400;"> ${
                                 countryCode + " " + mobile
                               }</span> </h6>

                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
    
                  <!--body end-->
    
                 <tr>
      <td>
        <table style=" width: 100%; padding-top: 20px;">
    
          <tr>
            <td align="center" style="padding-top: 20px">
              <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                <tbody>
                  <tr>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-14.665479,-157.42976)">
                            <g id="g16"
                              transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                              <g id="g14">
                                <circle id="circle10" data-original="#3B5998" r="56.098"
                                  cy="56.098" cx="56.098" style="fill:#3b5998" />
                                <path id="path12" className="active-path" data-original="#FFFFFF"
                                  d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                  style="fill:#ffffff" inkscape:connector-curvature="0" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                          <defs id="defs67" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata70">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-13.154175,-149.114)">
                            <g id="g83"
                              transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                              <g id="g81">
                                <circle id="circle75" className="" data-original="#55ACEE"
                                  r="56.098" cy="56.098" cx="56.098999"
                                  style="fill:#55acee" />
                                <g id="g79">
                                  <path id="path77" className="active-path"
                                    data-original="#F1F2F2"
                                    d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                    style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)"
                          sodipodi:docname="youtube-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-26.760715,-164.98928)">
                            <g id="g18"
                              transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                              <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                cx="256" style="fill:#d22215" />
                              <path id="path12" data-original="#A81411"
                                d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                style="fill:#a81411" inkscape:connector-curvature="0" />
                              <path id="path14" data-original="#FFFFFF"
                                d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                style="fill:#ffffff" inkscape:connector-curvature="0" />
                              <path id="path16" className="active-path" data-original="#D1D1D1"
                                d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                            </g>
                          </g>
                        </svg>
                      </p></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
              <span style="margin: 0; font-weight: 400; font-size: 13px;">
                Copyright 2024 <b>Offarat</b>
              </span>
            </td>
          </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
      </body>
    </html>
    `;
  },

  FORGOT_PASSWORD_OTP(username, otp) {
    return ` <!DOCTYPE html>
    <html>
    
    <head>
       <title>Welcome</title>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    
       <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
    
          body {
             font-family: 'Roboto', sans-serif;
          }
       </style>
    </head>
    
    <body style="background-color:#E6EEF2;color: #202020;padding: 50px 15px;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;">
       <br>
       <table style="width: 600px; background: #fff; margin: 0 auto; padding: 15px; height: 100%;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);">
        <tbody><tr>
            <td>
       <table style=" padding:10px 0px 30px 0px ; width: 100%;background:#f7f7f7; border-spacing: 0;  font-family: 'Roboto', sans-serif;">
          <tr>
             <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><a style="color: #FF0000; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT</a></td>
                      <td style="color: #FF0000; width: 70%; font-weight: 400; text-align: right;">
                          <p id="date"></p>
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
    <tr>
       <td style="background-color: #FF0000; " align="center">
          <table style="width: 100%; margin: 0 auto; ">
    
             <tr>
                <td style="width: 100%; text-align: center; padding-top: 15px; padding-bottom:15px;" colspan="2">
                   <h1 style="letter-spacing: 0.5px;color: #ffffff;line-height: 1.3; text-transform: uppercase; margin: 0;">
                      Warm Greetings ! !
                   </h1>
                </td>
    
             </tr>
    
          </table>
    
       </td>
    </tr>
    
    <tr>
       <td style="padding: 30px 28px 0px; ">
          <table style="width: 100%;">
             <tr>
                <td>
                   <h2 style="margin: 0;">Hi, ${
                     username ? username : "User"
                   }</h2>
                </td>
             </tr>
             <tr>
                <td style="padding-top: 15px; ">
                   <span style="margin: 0; font-weight: 400; font-size: 21px;">
                      Welcome to <b style="color: #FF0000;">Offarat</b>
                   </span>
    
                </td>
             </tr>
    
             <tr>
                <td>
                   <p  style="text-align:center;"> Enter below otp to restore your passwprd.
                   </p>
                   <h3 style="text-align:center;">OTP <span style="font-size:16px; font-weight:400;">is</span>  <span style="font-size:16px; font-weight:400;">${otp}</span> </h3>
                </td>
             </tr>
          </table>
       </td>
    </tr>
    
    
    
    <tr>
       <td style="padding: 12px 20px; ">
          <table style="background-color: #FF0000; width: 100%;">
    
             <tr>
                <td style="padding: 15px 15px; color: #fff;" align="center">
                   <span style="margin: 0; font-weight: 400; font-size: 20px;">
                      Thank you for joining the <b>Offarat</b>
                   </span>
    
                </td>
             </tr>
    
          </table>
       </td>
    </tr>
    
     <!--body end-->
      
     <tr>
      <td>
        <table style=" width: 100%; padding-top: 20px;">
    
          <tr>
            <td align="center" style="padding-top: 20px">
              <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                <tbody>
                  <tr>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-14.665479,-157.42976)">
                            <g id="g16"
                              transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                              <g id="g14">
                                <circle id="circle10" data-original="#3B5998" r="56.098"
                                  cy="56.098" cx="56.098" style="fill:#3b5998" />
                                <path id="path12" className="active-path" data-original="#FFFFFF"
                                  d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                  style="fill:#ffffff" inkscape:connector-curvature="0" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                          <defs id="defs67" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata70">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-13.154175,-149.114)">
                            <g id="g83"
                              transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                              <g id="g81">
                                <circle id="circle75" className="" data-original="#55ACEE"
                                  r="56.098" cy="56.098" cx="56.098999"
                                  style="fill:#55acee" />
                                <g id="g79">
                                  <path id="path77" className="active-path"
                                    data-original="#F1F2F2"
                                    d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                    style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)"
                          sodipodi:docname="youtube-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-26.760715,-164.98928)">
                            <g id="g18"
                              transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                              <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                cx="256" style="fill:#d22215" />
                              <path id="path12" data-original="#A81411"
                                d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                style="fill:#a81411" inkscape:connector-curvature="0" />
                              <path id="path14" data-original="#FFFFFF"
                                d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                style="fill:#ffffff" inkscape:connector-curvature="0" />
                              <path id="path16" className="active-path" data-original="#D1D1D1"
                                d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                            </g>
                          </g>
                        </svg>
                      </p></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
              <span style="margin: 0; font-weight: 400; font-size: 13px;">
                Copyright 2024 <b>Offarat</b>
              </span>
            </td>
          </tr>
    
    
    
    
        </table>
      </td>
    </tr>
    
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
    </body>
    <script>
    // Get the current date
    const currentDate = moment();

    // Format the date as "July 15th, 2024"
    const formattedDate = currentDate.format("MMMM Do, YYYY");

    // Display the formatted date in the HTML
    document.getElementById("date").innerHTML = formattedDate;
</script>
    </html>`;
  },

  RESET_PASSWORD_LINK(link) {
    return `<!DOCTYPE html>
    <html>
    
    <head>
       <title>Welcome</title>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    
       <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
    
          body {
             font-family: 'Roboto', sans-serif;
          }
       </style>
    </head>
    
    <body style="background-color:#E6EEF2;color: #202020;padding: 50px 15px;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;">
       <br>
       <table style="max-width: 600px; background: #fff; margin: 0 auto; padding: 15px; height: 100%;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);">
        <tbody><tr>
            <td>
       <table style=" padding:10px 0px 30px 0px ; width: 100%;background:#f7f7f7; border-spacing: 0;  font-family: 'Roboto', sans-serif;">
          <tr>
             <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><b style="color:#da2a2c; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT </b></td>
                      <td style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right;">
                       ${moment(todayDate).format("DD-MMM-YYYY").toUpperCase()}
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
    <tr>
       <td style="background-color: #da2a2c ; " align="center">
          <table style="width: 100%; margin: 0 auto; ">
    
             <tr>
                <td style="width: 100%; text-align: center; padding-top: 15px; padding-bottom:15px;" colspan="2">
                   <h1 style="letter-spacing: 0.5px;color: #ffffff;line-height: 1.3; text-transform: uppercase; margin: 0;">
                      Warm Greetings ! !
                   </h1>
                </td>
    
             </tr>
    
          </table>
    
       </td>
    </tr>
    
    <tr>
       <td style="padding: 30px 28px 0px; ">
       
       
          <table style="width: 100%;">
             <tr>
                <td>
                   <h2 style="margin: 0;"> Password Reset</h2>
                </td>
             </tr>
             <tr>
                <td style="padding-top: 25px; ">
                
                    If you've forgotten your password or would like to reset it, please use the link below.
                  
    
                </td>
             </tr>
    
             <tr>
             <td  style="padding-top: 25px; ">
             <h3 style="text-align:center;"><a target="_blank" style="text-decoration:none; color:white;background-color: #da2a2c !important;" href =${link}>Click here </a> </h3>
          </td>
             </tr>
          </table>
       </td>
    </tr>
    
    
     <!--body end-->
      
     <tr>
      <td>
        <table style=" width: 100%; padding-top: 20px;">
    
          <tr>
            <td align="center" style="padding-top: 20px">
              <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                <tbody>
                  <tr>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-14.665479,-157.42976)">
                            <g id="g16"
                              transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                              <g id="g14">
                                <circle id="circle10" data-original="#3B5998" r="56.098"
                                  cy="56.098" cx="56.098" style="fill:#3b5998" />
                                <path id="path12" className="active-path" data-original="#FFFFFF"
                                  d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                  style="fill:#ffffff" inkscape:connector-curvature="0" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                          <defs id="defs67" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata70">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-13.154175,-149.114)">
                            <g id="g83"
                              transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                              <g id="g81">
                                <circle id="circle75" className="" data-original="#55ACEE"
                                  r="56.098" cy="56.098" cx="56.098999"
                                  style="fill:#55acee" />
                                <g id="g79">
                                  <path id="path77" className="active-path"
                                    data-original="#F1F2F2"
                                    d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                    style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)"
                          sodipodi:docname="youtube-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-26.760715,-164.98928)">
                            <g id="g18"
                              transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                              <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                cx="256" style="fill:#d22215" />
                              <path id="path12" data-original="#A81411"
                                d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                style="fill:#a81411" inkscape:connector-curvature="0" />
                              <path id="path14" data-original="#FFFFFF"
                                d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                style="fill:#ffffff" inkscape:connector-curvature="0" />
                              <path id="path16" className="active-path" data-original="#D1D1D1"
                                d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                            </g>
                          </g>
                        </svg>
                      </p></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
              <span style="margin: 0; font-weight: 400; font-size: 13px;">
                Copyright 2024 <b>Offarat</b>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
    </body>
    <script>
    // Get the current date
    const currentDate = moment();

    // Format the date as "July 15th, 2024"
    const formattedDate = currentDate.format("MMMM Do, YYYY");

    // Display the formatted date in the HTML
    document.getElementById("date").innerHTML = formattedDate;
      </script>
    </html>`;
  },

  ADD_USER_MAIL(email, password) {
    return `<!DOCTYPE html>
    <html>
      <head>
        <title>Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap");
    
          body {
            font-family: "Roboto", sans-serif;
          }
        </style>
      </head>
    
      <body
        style="
          background-color: #e6eef2;
          color: #202020;
          padding: 50px 15px;
          font-size: 15px;
          line-height: 24px;
          font-family: 'Roboto', sans-serif;
        "
      >
        <br />
        <table
          style="
            max-width: 600px;
            background: #fff;
            margin: 0 auto;
            padding: 15px;
            height: 100%;
            box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);
          "
        >
          <tbody>
            <tr>
              <td>
                <table
                  style="
                    padding: 10px 0px 30px 0px;
                    width: 100%;
                    background: #f7f7f7;
                    border-spacing: 0;
                    font-family: 'Roboto', sans-serif;
                  "
                >
                  <tr>
                    <td>
                      <table
                        style="
                          width: 100%;
                          border-bottom: 1px solid #eee;
                          padding: 0px 15px;
                        "
                      >
                        <tr>
                          <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><b style="color:#da2a2c; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT </b></td>
                      <td style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right;">
                       ${moment(todayDate).format("DD-MMM-YYYY").toUpperCase()}
                      </td>
                   </tr>
                </table>
             </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
    
                  <!--- body start-->
                  <tr>
                    <td style="background-color:#da2a2c" align="center">
                      <table style="width: 100%; margin: 0 auto">
                        <tr>
                          <td
                            style="
                              width: 100%;
                              text-align: center;
                              padding-top: 15px;
                              padding-bottom: 15px;
                            "
                            colspan="2"
                          >
                            <h1
                              style="
                                letter-spacing: 0.5px;
                                color: #ffffff;
                                line-height: 1.3;
                                margin: 0;
                              "
                            >
                            Login credentials for offarat ! !
                            </h1>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
    
                  <tr>
                    <td style="padding: 30px 28px">
                      <table style="width: 100%">
                        
                        <tr>
                          <td style="padding-top: 15px">
                        
                          </td>
                        </tr>
                        <tr>
                        
                          <td style="padding-top: 0; color: #3c3c3c">
                          <br>
                          <span
                              style="margin: 0; font-weight: 400; font-size: 21px"
                            >
                               </span>
                               <h6>Email <span style="font-size:16px; font-weight:400;">:</span>  <span style="font-size:16px; font-weight:400;"> ${email}</span> </h6>
                               <h6>Password <span style="font-size:16px; font-weight:400;">:</span>  <span style="font-size:16px; font-weight:400;"> ${password}</span> </h6>
                             

                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
    
                  <!--body end-->
    
                 <tr>
      <td>
        <table style=" width: 100%; padding-top: 20px;">
    
          <tr>
            <td align="center" style="padding-top: 20px">
              <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                <tbody>
                  <tr>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-14.665479,-157.42976)">
                            <g id="g16"
                              transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                              <g id="g14">
                                <circle id="circle10" data-original="#3B5998" r="56.098"
                                  cy="56.098" cx="56.098" style="fill:#3b5998" />
                                <path id="path12" className="active-path" data-original="#FFFFFF"
                                  d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                  style="fill:#ffffff" inkscape:connector-curvature="0" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                          <defs id="defs67" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata70">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-13.154175,-149.114)">
                            <g id="g83"
                              transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                              <g id="g81">
                                <circle id="circle75" className="" data-original="#55ACEE"
                                  r="56.098" cy="56.098" cx="56.098999"
                                  style="fill:#55acee" />
                                <g id="g79">
                                  <path id="path77" className="active-path"
                                    data-original="#F1F2F2"
                                    d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                    style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)"
                          sodipodi:docname="youtube-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-26.760715,-164.98928)">
                            <g id="g18"
                              transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                              <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                cx="256" style="fill:#d22215" />
                              <path id="path12" data-original="#A81411"
                                d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                style="fill:#a81411" inkscape:connector-curvature="0" />
                              <path id="path14" data-original="#FFFFFF"
                                d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                style="fill:#ffffff" inkscape:connector-curvature="0" />
                              <path id="path16" className="active-path" data-original="#D1D1D1"
                                d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                            </g>
                          </g>
                        </svg>
                      </p></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
              <span style="margin: 0; font-weight: 400; font-size: 13px;">
                Copyright 2024 <b>Offarat</b>
              </span>
            </td>
          </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
      </body>
    </html>
    `;
  },

  // Invoice for seller
  SELLER_ORDER_TEMPLATE(
    username,
    companyName,
    area,
    address,
    mobile,
    invoiceNumber,
    payBy,
    date,
    delivery,
    products,
    subTotal,
    discount,
    deliveryCharge,
    total,
    contactMobile
  ) {
    const productRows = products

      .map((product) => {
        return `
              <tr>
                <td style="padding: 8px 8px; line-height: 20px; text-align: center">${
                  product.productName
                }</td>
                   <td style="padding: 8px 8px; line-height: 20px; text-align: center">${
                     product.quantity
                   }</td>
                   <td style="padding: 8px 8px; line-height: 20px; text-align: center">${formatNumber(
                     product.product_price
                   )}</td>
              </tr>
          `;
      })
      .join("");

    return `<html>
  <head>
    <style>
      body {
        font-family: sans-serif;
        font-size: 10pt;
      }

      p {
        margin: 0pt;
      }

      table.items {
        border: 0.1mm solid #e7e7e7;
      }

      td {
        vertical-align: middel;
      }

      .items td {
        border-left: 0.1mm solid #000;
        border-right: 0.1mm solid #000;
        border-bottom: 0.1mm solid #000;

      }

      table thead td {
        text-align: center;
        border: 0.1mm solid #000;
      }

      .items td.blanktotal {
        background-color: #eeeeee;
        border: 0.1mm solid #e7e7e7;
        background-color: #ffffff;
        border: 0mm none #e7e7e7;
        border-top: 0.1mm solid #e7e7e7;
        border-right: 0.1mm solid #e7e7e7;
      }

      .items td.totals {
        text-align: right;
        border: 0.1mm solid #e7e7e7;
      }

      .items td.cost {
        text-align: "." center;
      }
    </style>
  </head>

  <body>
  <table width="650px;" style="border: 1px solid #e7e7e7; padding: 50px;" align="center">
  <tr>
  <td>
  <table width="100%" style="font-family: sans-serif" cellpadding="10">
      <tr>
        <td width="100%" style="padding: 0px; text-align: center">
          <h4
            style="
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              padding: 0px;
            "
          >
            <b>${companyName}</b>
          </h4>
        </td>
      </tr>
      <tr>
        <td >
              <img
                width="150px"
                height="100px"
               src="${process.env.SERVER_API_URL}/api/public/images/logo.png"
              />
          </td>
      </tr>
      <tr>
        <td
          width="100%"
          style="
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            padding: 0px;
          "
        >
        Invoice
        </td>
      </tr>
      <tr>
        <td
          height="10"
          style="font-size: 0px; line-height: 10px; height: 10px; padding: 0px"
        >
          &nbsp;
        </td>
      </tr>
    </table>
    <table
      width="100%"
      style="font-family: sans-serif; text-align: center"
      cellpadding="10"
    >
      <tr>
        <td width="33.3%">Client Name</td>
        <td width="33.3%"> ${username}</td>
        <td width="33.3%">اسم العميل</td>
      </tr>
      ${
        area
          ? `<tr>
        <td width="33.3%">Area</td>
        <td width="33.3%">${area}</td>
        <td width="33.3%">المنطقة</td>
      </tr>`
          : ""
      } 
      ${
        address
          ? `<tr>
        <td width="33.3%">Address</td>
        <td width="33.3%">${address}</td>
        <td width="33.3%">العنوان</td>
      </tr>`
          : ""
      }
      
      <tr>
        <td width="33.3%">Phone Number</td>
        <td width="33.3%"> ${mobile}</td>
        <td width="33.3%">رقم الهاتف</td>
      </tr>
      <tr>
        <td width="33.3%">Invoice Number</td>
        <td width="33.3%">${invoiceNumber}</td>
        <td width="33.3%"> رقم الفاتورة</td>
      </tr>
      <tr>
        <td width="33.3%">Pay By</td>
        <td width="33.3%"> ${payBy}</td>
        <td width="33.3%"> طريقة الدفع</td>
      </tr>
      <tr>
        <td width="33.3%">Date</td>
        <td width="33.3%">${moment(date)
          .format("DD-MMM-YYYY")
          .toUpperCase()}</td>
        <td width="33.3%">التاريخ</td>
      </tr>
       ${
         delivery
           ? `<tr>
        <td width="33.3%">Delivery</td>
        <td width="33.3%">${delivery}</td>
        <td width="33.3%">التسليم</td>
      </tr>`
           : ""
       }
    </table>
    <br />

    <table
      className="items"
      width="100%"
      style="font-size: 14px; border-collapse: collapse"
      cellpadding="8"
    >
      <thead>
        <tr>
          <td width="35%" style="text-align: center; background-color: #e7e7e7;">
            <h4 style="margin: 0;">Item</h4>
          </td>
          <td width="25%" style="text-align: center; background-color: #e7e7e7;">
            <h4 style="margin: 0;">Qty.</h4>
          </td>
          <td width="20%" style="text-align: center; background-color: #e7e7e7;">
            <h4 style="margin: 0;">Amount</h4>
          </td> 
        </tr>
      </thead>
      <tbody>
        ${productRows}
      </tbody>
    </table>
    <br />
    <table width="100%" style="font-family: sans-serif; font-size: 14px">
      <tr>

        <td style="width: 40%">
          <table
            width="100%"
            align="right"
            style="font-family: sans-serif; font-size: 14px"
          >
            <tr>
              <td
                style="
                text-align: center;
                  padding: 10px 8px;
                  line-height: 20px;
                "
              >
                <strong>Sub Total </strong> :   ${subTotal} KD
              </td>
      
            </tr>
            <tr>
              <td
                style="
                  text-align: center;
                  padding: 10px 8px;
                  line-height: 20px;
                "
              >
                <strong>Discount </strong>: ${discount} KD
              </td>
              
            </tr>

            <tr>
            <td
              style="
                text-align: center;
                padding: 10px 8px;
                line-height: 20px;
              "
            >
              <strong>Delivery Charge </strong>: ${deliveryCharge} KD
            </td>
            
          </tr>

            <tr>
              <td
                style="
                text-align: center;
                  padding: 10px 8px;
                  line-height: 20px;
                "
              >
                <strong>Net Total </strong>: ${total} KD
              </td>
             
            </tr>
          </table>
        </td>
     
      </tr>
    </table>
    <br />
    <table width="100%" style="font-family: sans-serif; font-size: 14px">
      <tr>
        <td>
      
          <table
            width="100%"
            align="left"
            style="font-family: sans-serif; font-size: 13px; text-align: center"
          >
            <tr>
              <td style="padding: 0px; line-height: 20px">
                <br />
                Thanks you for using offarat app
                <br />
                شكراً لك على استخدام تطبيق أوفرات
                <br />
                Call center: ${contactMobile}

                <br />
              </td>
            </tr>
          </table>
       
        </td>
      </tr>
    </table>
  </td>
  </tr>
  </table>
  </body>
</html>
`;
  },

  // Invoice with coupon template for user
  COUPON_TEMPLATE(
    companyName,
    username,
    area,
    address,
    mobile,
    invoiceNumber,
    payBy,
    date,
    delivery,
    products,
    subTotal,
    discount,
    deliveryCharge,
    total,
    contactMobile,
    couponArray
  ) {
    const productRows = products
      .map((product) => {
        return `
                <tr>
                  <td style="padding: 8px 8px; line-height: 20px; text-align: center">${
                    product.productName
                  }</td>
                     <td style="padding: 8px 8px; line-height: 20px; text-align: center">${
                       product.quantity
                     }</td>
                     <td style="padding: 8px 8px; line-height: 20px; text-align: center">${formatNumber(
                       product.product_price
                     )}</td>
                </tr>
            `;
      })
      .join("");

    const couponData = couponArray
      .map((CUPON) => {
        return `
             <tr>
            <td>
              <table
                width="100%"
                style="
                  font-family: sans-serif;
                  font-size: 14px;
                  border: 1px solid #ccc;
                "
              >
                <tr>
                  <td style="width: 50%">
                    <table
                      width="100%"
                      align="left"
                      style="font-family: sans-serif; font-size: 14px"
                    >
                      <tr>
                        <td
                          style="
                            padding: 5px 5px;
                            line-height: 20px;
                            border: 1px solid #ccc;
                          "
                        >
                          <strong>Coupon Code</strong>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 5px 5px;
                            line-height: 20px;
                            border: 1px solid #ccc;
                          "
                        >
                        ${CUPON.couponCode}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 5px 5px;
                            line-height: 20px;
                            border: 1px solid #ccc;
                          "
                        >
                          <img
                            width="300px"
                            height="150px"
                            src="${CUPON.barcodeBase64}"
                          />
                        </td>
                      </tr>
                    </table>
                  </td>

                  <td style="width: 20%">
                    <table
                      width="100%"
                      align="left"
                      style="font-family: sans-serif; font-size: 14px"
                    >
                      <tr>
                        <td
                          style="
                            padding: 10px;
                            line-height: 20px;
                            text-align: center;
                          "
                        >
                          <img
                            width="200px"
                            height="200px"
                            src="${CUPON.qrCodeBase64}"
                          />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" align="center">
                <tr>
                  <td
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      border: 1px solid #ccc;
                      width: 50%;
                      padding: 20px 10px;
                      text-align: center;
                    "
                  >
                  <img
                           width="150"
                            height="100"
                            src="${CUPON.images}"
                          />
                  </td>
                  <td
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      border: 1px solid #ccc;
                      width: 50%;
                      padding: 20px 10px;
                      text-align: center;
                    "
                  >
                    <p>${CUPON.item}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" align="center">
                <tr>
                  <td
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      border: 1px solid #ccc;
                      width: 50%;
                      padding: 20px 10px;
                      text-align: center;
                    "
                  >
                      <p>${CUPON.itemDescription}
                  </td>
                </tr>
              </table>

              <table width="100%" align="center">
                <tr>
                  <td
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      border: 1px solid #ccc;
                      width: 50%;
                      padding: 10px;
                      text-align: left;
                    "
                  >
                    <b>Date of purchase </b>
                  </td>
                  <td
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      border: 1px solid #ccc;
                      width: 50%;
                      padding: 10px;
                      text-align: left;
                    "
                  >
                    <p>${moment(CUPON.createdAt)
                      .format("DD-MMM-YYYY")
                      .toUpperCase()}</p>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      border: 1px solid #ccc;
                      width: 50%;
                      padding: 10px;
                      text-align: left;
                    "
                  >
                    <b>Validity</b>
                  </td>
                  <td
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      border: 1px solid #ccc;
                      width: 50%;
                      padding: 10px;
                      text-align: left;
                    "
                  >
                    <p>${moment(CUPON.startDate)
                      .format("DD-MMM-YYYY")
                      .toUpperCase()}  '-'  ${moment(CUPON.endDate)
          .format("DD-MMM-YYYY")
          .toUpperCase()}</p>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      border: 1px solid #ccc;
                      width: 50%;
                      padding: 10px;
                      text-align: left;
                    "
                  >
                    <b>Coupon code</b>
                  </td>
                  <td
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      border: 1px solid #ccc;
                      width: 50%;
                      padding: 10px;
                      text-align: left;
                    "
                  >
                    <p>${CUPON.couponCode}</p>
                  </td>
                </tr>

              </table>

              <table width="100%" align="center">
                <tr>
                  <td
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      border: 1px solid red;
                      width: 100%;
                      padding: 15px 10px;
                      text-align: center;
                      background: red;
                    "
                  >
                    <h4 style="color: #fff; margin: 0">Thanks for Using Offrat</h4>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
      })
      .join("");

    return `<html>
    <head>
      <style>
        body {
          font-family: sans-serif;
          font-size: 10pt;
        }

        p {
          margin: 0pt;
        }

        table.items {
          border: 0.1mm solid #e7e7e7;
        }

        td {
          vertical-align: middel;
        }

        .items td {
          border-left: 0.1mm solid #000;
          border-right: 0.1mm solid #000;
          border-bottom: 0.1mm solid #000;

        }

        table thead td {
          text-align: center;
          border: 0.1mm solid #000;
        }

        .items td.blanktotal {
          background-color: #eeeeee;
          border: 0.1mm solid #e7e7e7;
          background-color: #ffffff;
          border: 0mm none #e7e7e7;
          border-top: 0.1mm solid #e7e7e7;
          border-right: 0.1mm solid #e7e7e7;
        }

        .items td.totals {
          text-align: right;
          border: 0.1mm solid #e7e7e7;
        }

        .items td.cost {
          text-align: "." center;
        }
      </style>
    </head>

    <body>
    <table width="650px;" style="border: 1px solid #e7e7e7; padding: 50px;" align="center">
    <tr>
    <td>
    <table width="100%" style="font-family: sans-serif" cellpadding="10">
        <tr>
          <td width="100%" style="padding: 0px; text-align: center">
            <h4
              style="
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                padding: 0px;
              "
            >
              <b>${companyName}</b>
            </h4>
          </td>
        </tr>
        <tr>
          <td >
                <img
                  width="150px"
                  height="100px"
                 src="${process.env.SERVER_API_URL}/api/public/images/logo.png"
                />
            </td>
        </tr>
        <tr>
          <td
            width="100%"
            style="
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              padding: 0px;
            "
          >
          Invoice
          </td>
        </tr>
        <tr>
          <td
            height="10"
            style="font-size: 0px; line-height: 10px; height: 10px; padding: 0px"
          >
            &nbsp;
          </td>
        </tr>
      </table>
      <table
        width="100%"
        style="font-family: sans-serif; text-align: center"
        cellpadding="10"
      >
        <tr>
          <td width="33.3%">Client Name</td>
          <td width="33.3%"> ${username}</td>
          <td width="33.3%">اسم العميل</td>
        </tr>
        ${
          area
            ? `<tr>
          <td width="33.3%">Area</td>
          <td width="33.3%">${area}</td>
          <td width="33.3%">المنطقة</td>
        </tr>`
            : ""
        }
        ${
          address
            ? `<tr>
          <td width="33.3%">Address</td>
          <td width="33.3%">${address}</td>
          <td width="33.3%">العنوان</td>
        </tr>`
            : ""
        }

        <tr>
          <td width="33.3%">Phone Number</td>
          <td width="33.3%"> ${mobile}</td>
          <td width="33.3%">رقم الهاتف</td>
        </tr>
        // <tr>
        //   <td width="33.3%">Invoice Number</td>
        //   <td width="33.3%">${invoiceNumber}</td>
        //   <td width="33.3%"> رقم الفاتورة</td>
        // </tr>
        <tr>
          <td width="33.3%">Pay By</td>
          <td width="33.3%"> ${payBy}</td>
          <td width="33.3%"> طريقة الدفع</td>
        </tr>
        <tr>
          <td width="33.3%">Date</td>
          <td width="33.3%">${moment(date)
            .format("DD-MMM-YYYY")
            .toUpperCase()}</td>
          <td width="33.3%">التاريخ</td>
        </tr>
        <tr>
          <td width="33.3%">Delivery</td>
          <td width="33.3%">${delivery}</td>
          <td width="33.3%">التسليم</td>
        </tr>
      </table>
      <br />

      <table
        className="items"
        width="100%"
        style="font-size: 14px; border-collapse: collapse"
        cellpadding="8"
      >
        <thead>
          <tr>
            <td width="35%" style="text-align: center; background-color: #e7e7e7;">
              <h4 style="margin: 0;">Item</h4>
            </td>
            <td width="25%" style="text-align: center; background-color: #e7e7e7;">
              <h4 style="margin: 0;">Qty.</h4>
            </td>
            <td width="20%" style="text-align: center; background-color: #e7e7e7;">
              <h4 style="margin: 0;">Amount</h4>
            </td>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>
      <br />
      <table width="100%" style="font-family: sans-serif; font-size: 14px">
        <tr>

          <td style="width: 40%">
            <table
              width="100%"
              align="right"
              style="font-family: sans-serif; font-size: 14px"
            >
              <tr>
                <td
                  style="
                  text-align: center;
                    padding: 10px 8px;
                    line-height: 20px;
                  "
                >
                  <strong>Sub Total </strong> :   ${subTotal} KD
                </td>

              </tr>
              <tr>
                <td
                  style="
                    text-align: center;
                    padding: 10px 8px;
                    line-height: 20px;
                  "
                >
                  <strong>Discount </strong>: ${discount} KD
                </td>

              </tr>

              <tr>
              <td
                style="
                  text-align: center;
                  padding: 10px 8px;
                  line-height: 20px;
                "
              >
                <strong>Delivery Charge </strong>: ${deliveryCharge} KD
              </td>

            </tr>

              <tr>
                <td
                  style="
                  text-align: center;
                    padding: 10px 8px;
                    line-height: 20px;
                  "
                >
                  <strong>Net Total </strong>: ${total} KD
                </td>

              </tr>
            </table>
          </td>

        </tr>
      </table>
      <br />
      <table width="100%" style="font-family: sans-serif; font-size: 14px">
        <tr>
          <td>

            <table
              width="100%"
              align="left"
              style="font-family: sans-serif; font-size: 13px; text-align: center"
            >
              <tr>
                <td style="padding: 0px; line-height: 20px">
                  <br />
                  Thanks you for using offarat app
                  <br />
                  شكراً لك على استخدام تطبيق أوفرات
                  <br />
                  Call center: ${contactMobile}
                  <br />
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
      <br>
   <table
            width="100%"
            style="font-family: sans-serif; font-size: 14px; border: 1px solid #222; margin-bottom: 25px;"
          >
          ${couponData}
      </table>

    </td>
    </tr>

    </table>

    </body>
  </html>
  `;
  },

  // Invoice with out coupon template for user
  ORDER_INCOICE(
    companyName,
    username,
    area,
    address,
    mobile,
    invoiceNumber,
    payBy,
    date,
    delivery,
    products,
    subTotal,
    discount,
    deliveryCharge,
    total,
    contactMobile
  ) {
    const productRows = products
      .map((product) => {
        return `
              <tr>
                <td style="padding: 8px 8px; line-height: 20px; text-align: center">${
                  product.productName
                }</td>
                   <td style="padding: 8px 8px; line-height: 20px; text-align: center">${
                     product.quantity
                   }</td>
                   <td style="padding: 8px 8px; line-height: 20px; text-align: center">${formatNumber(
                     product.product_price
                   )}</td>
              </tr>
          `;
      })
      .join("");

    return `<html>
  <head>
    <style>
      body {
        font-family: sans-serif;
        font-size: 10pt;
      }

      p {
        margin: 0pt;
      }

      table.items {
        border: 0.1mm solid #e7e7e7;
      }

      td {
        vertical-align: middel;
      }

      .items td {
        border-left: 0.1mm solid #000;
        border-right: 0.1mm solid #000;
        border-bottom: 0.1mm solid #000;

      }

      table thead td {
        text-align: center;
        border: 0.1mm solid #000;
      }

      .items td.blanktotal {
        background-color: #eeeeee;
        border: 0.1mm solid #e7e7e7;
        background-color: #ffffff;
        border: 0mm none #e7e7e7;
        border-top: 0.1mm solid #e7e7e7;
        border-right: 0.1mm solid #e7e7e7;
      }

      .items td.totals {
        text-align: right;
        border: 0.1mm solid #e7e7e7;
      }

      .items td.cost {
        text-align: "." center;
      }
    </style>
  </head>

  <body>
  <table width="650px;" style="border: 1px solid #e7e7e7; padding: 50px;" align="center">
  <tr>
  <td>
  <table width="100%" style="font-family: sans-serif" cellpadding="10">
      <tr>
        <td width="100%" style="padding: 0px; text-align: center">
          <h4
            style="
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              padding: 0px;
            "
          >
            <b>${companyName}</b>
          </h4>
        </td>
      </tr>
      <tr>
        <td >
              <img
                width="150px"
                height="100px"
               src="${process.env.SERVER_API_URL}/api/public/images/logo.png"
              />
          </td>
      </tr>
      <tr>
        <td
          width="100%"
          style="
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            padding: 0px;
          "
        >
        Invoice
        </td>
      </tr>
      <tr>
        <td
          height="10"
          style="font-size: 0px; line-height: 10px; height: 10px; padding: 0px"
        >
          &nbsp;
        </td>
      </tr>
    </table>
    <table
      width="100%"
      style="font-family: sans-serif; text-align: center"
      cellpadding="10"
    >
      <tr>
        <td width="33.3%">Client Name</td>
        <td width="33.3%"> ${username}</td>
        <td width="33.3%">اسم العميل</td>
      </tr>
      <tr>
        <td width="33.3%">Area</td>
        <td width="33.3%">${area}</td>
        <td width="33.3%">المنطقة</td>
      </tr>
      <tr>
        <td width="33.3%">Address</td>
        <td width="33.3%">${address}</td>
        <td width="33.3%">العنوان</td>
      </tr>
      <tr>
        <td width="33.3%">Phone Number</td>
        <td width="33.3%"> ${mobile}</td>
        <td width="33.3%">رقم الهاتف</td>
      </tr>
      <tr>
        <td width="33.3%">Invoice Number</td>
        <td width="33.3%">${invoiceNumber}</td>
        <td width="33.3%"> رقم الفاتورة</td>
      </tr>
      <tr>
        <td width="33.3%">Pay By</td>
        <td width="33.3%"> ${payBy}</td>
        <td width="33.3%"> طريقة الدفع</td>
      </tr>
      <tr>
        <td width="33.3%">Date</td>
        <td width="33.3%">${moment(date)
          .format("DD-MMM-YYYY")
          .toUpperCase()}</td>
        <td width="33.3%">التاريخ</td>
      </tr>
      ${
        delivery
          ? `<tr>
        <td width="33.3%">Delivery</td>
        <td width="33.3%">${delivery}</td>
        <td width="33.3%">التسليم</td>
      </tr>`
          : ""
      }
    </table>
    <br />

    <table
      className="items"
      width="100%"
      style="font-size: 14px; border-collapse: collapse"
      cellpadding="8"
    >
      <thead>
        <tr>
          <td width="35%" style="text-align: center; background-color: #e7e7e7;">
            <h4 style="margin: 0;">Item</h4>
          </td>
          <td width="25%" style="text-align: center; background-color: #e7e7e7;">
            <h4 style="margin: 0;">Qty.</h4>
          </td>
          <td width="20%" style="text-align: center; background-color: #e7e7e7;">
            <h4 style="margin: 0;">Amount</h4>
          </td> 
        </tr>
      </thead>
      <tbody>
        ${productRows}
      </tbody>
    </table>
    <br />
    <table width="100%" style="font-family: sans-serif; font-size: 14px">
      <tr>

        <td style="width: 40%">
          <table
            width="100%"
            align="right"
            style="font-family: sans-serif; font-size: 14px"
          >
            <tr>
              <td
                style="
                text-align: center;
                  padding: 10px 8px;
                  line-height: 20px;
                "
              >
                <strong>Sub Total </strong> :   ${subTotal} KD
              </td>
      
            </tr>
            <tr>
              <td
                style="
                  text-align: center;
                  padding: 10px 8px;
                  line-height: 20px;
                "
              >
                <strong>Discount </strong>: ${discount} KD
              </td>
              
            </tr>

            <tr>
            <td
              style="
                text-align: center;
                padding: 10px 8px;
                line-height: 20px;
              "
            >
              <strong>Delivery Charge </strong>: ${deliveryCharge} KD
            </td>
            
          </tr>

            <tr>
              <td
                style="
                text-align: center;
                  padding: 10px 8px;
                  line-height: 20px;
                "
              >
                <strong>Net Total </strong>: ${total} KD
              </td>
             
            </tr>
          </table>
        </td>
     
      </tr>
    </table>
    <br />
    <table width="100%" style="font-family: sans-serif; font-size: 14px">
      <tr>
        <td>
      
          <table
            width="100%"
            align="left"
            style="font-family: sans-serif; font-size: 13px; text-align: center"
          >
            <tr>
              <td style="padding: 0px; line-height: 20px">
                <br />
                Thanks you for using offarat app
                <br />
                شكراً لك على استخدام تطبيق أوفرات
                <br />
              Call center: ${contactMobile}
                <br />
              </td>
            </tr>
          </table>
       
        </td>
      </tr>
    </table>
  </td>
  </tr>
  </table>
  </body>
</html>
`;
  },

  WALLET_EMAIL(name, amount, startDate, endDate, description) {
    return `<!DOCTYPE html>
    <html>
    
    <head>
       <title>Welcome</title>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

       <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
    
          body {
             font-family: 'Roboto', sans-serif;
          }
       </style>
    </head>
    
    <body style="background-color:#E6EEF2;color: #202020;padding: 50px 15px;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;">
       <br>
       <table style="max-width: 600px; background: #fff; margin: 0 auto; padding: 15px; height: 100%;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);">
        <tbody><tr>
            <td>
       <table style=" padding:10px 0px 30px 0px ; width: 100%;background:#f7f7f7; border-spacing: 0;  font-family: 'Roboto', sans-serif;">
          <tr>
               <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><b style="color: #da2a2c; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT </b></td>
                      <td style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right;">
                       ${moment(todayDate).format("DD-MMM-YYYY").toUpperCase()}
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
    
      <!--- body start-->
      <tr>
             <td style="background-color:#da2a2c; " align="center">
                <table style="width: 100%; margin: 0 auto; ">
    
                   <tr>
                      <td style="width: 100%; text-align: center; padding-top: 15px; padding-bottom:15px;" colspan="2">
                         <h1
                            style="letter-spacing: 0.5px;color: #ffffff;line-height: 1.3; text-transform: uppercase; margin: 0;">
                            Congratulations! 
                         </h1>
                      </td>
    
                   </tr>
                
                </table>
    
             </td>
          </tr>
      
          <tr>
             <td style="padding: 30px 28px; ">
                <table style="width: 100%;">
                   <tr>
                      <td>
                         <h2 style="margin: 0;">Hi, ${name}</h2>
                      </td>
                   </tr>
                 
                   <tr>
                      <td style="padding-top: 15px; ">
                      <span style="margin: 0; font-weight: 400; font-size: 21px;">
                      You have received a cashback of ${amount} KD. 
                      </span>
                      </td>
                       </tr>
                       
                     <tr>
                      <td style="padding-top: 15px; ">
                      <span style="margin: 0; font-weight: 400; font-size: 21px;">
                      Validity <br>
                      <p>${moment(startDate).format("DD-MMM-YYYY")} to ${moment(
      endDate
    ).format("DD-MMM-YYYY")}</p>
                      </span>
                         
    
                      </td>
                     </tr>
                     
                      <td style="padding-top: 15px; ">
                      <span style="margin: 0; font-weight: 400; font-size: 21px;">
                    Description<br>
                    ${description}
                      </span>
                      </td>
                     </tr>
               
                   <tr>
                      <td style="padding-top: 0; color: #3c3c3c;">
                         <span style="margin: 0; font-weight: 400; font-size: 16px;">
                         </span>
    
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
      
         
      <!--body end-->
      
      <tr>
      <td>
        <table style=" width: 100%; padding-top: 20px;">
    
          <tr>
            <td align="center" style="padding-top: 20px">
              <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                <tbody>
                  <tr>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">I
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-14.665479,-157.42976)">
                            <g id="g16"
                              transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                              <g id="g14">
                                <circle id="circle10" data-original="#3B5998" r="56.098"
                                  cy="56.098" cx="56.098" style="fill:#3b5998" />
                                <path id="path12" className="active-path" data-original="#FFFFFF"
                                  d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                  style="fill:#ffffff" inkscape:connector-curvature="0" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                          <defs id="defs67" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata70">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-13.154175,-149.114)">
                            <g id="g83"
                              transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                              <g id="g81">
                                <circle id="circle75" className="" data-original="#55ACEE"
                                  r="56.098" cy="56.098" cx="56.098999"
                                  style="fill:#55acee" />
                                <g id="g79">
                                  <path id="path77" className="active-path"
                                    data-original="#F1F2F2"
                                    d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                    style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)"
                          sodipodi:docname="youtube-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-26.760715,-164.98928)">
                            <g id="g18"
                              transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                              <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                cx="256" style="fill:#d22215" />
                              <path id="path12" data-original="#A81411"
                                d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                style="fill:#a81411" inkscape:connector-curvature="0" />
                              <path id="path14" data-original="#FFFFFF"
                                d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                style="fill:#ffffff" inkscape:connector-curvature="0" />
                              <path id="path16" className="active-path" data-original="#D1D1D1"
                                d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                            </g>
                          </g>
                        </svg>
                      </p></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
              <span style="margin: 0; font-weight: 400; font-size: 13px;">
                Copyright 2024 <b>Offarat</b>
              </span>
            </td>
          </tr>
    
    
    
    
        </table>
      </td>
    </tr>
    
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
    </body>
    
    </html>`;
  },

  POINT_EMAIL(name, points) {
    return `<!DOCTYPE html>
    <html>
    
    <head>
       <title>Welcome</title>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

       <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
    
          body {
             font-family: 'Roboto', sans-serif;
          }
       </style>
    </head>
    
    <body style="background-color:#E6EEF2;color: #202020;padding: 50px 15px;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;">
       <br>
       <table style="max-width: 600px; background: #fff; margin: 0 auto; padding: 15px; height: 100%;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);">
        <tbody><tr>
            <td>
       <table style=" padding:10px 0px 30px 0px ; width: 100%;background:#f7f7f7; border-spacing: 0;  font-family: 'Roboto', sans-serif;">
          <tr>
             <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><b style="color: #da2a2c; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT </b></td>
                      <td style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right;">
                       ${moment(todayDate).format("DD-MMM-YYYY").toUpperCase()}
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
    
      <!--- body start-->
      <tr>
             <td style="background-color: #da2a2c; " align="center">
                <table style="width: 100%; margin: 0 auto; ">
    
                   <tr>
                      <td style="width: 100%; text-align: center; padding-top: 15px; padding-bottom:15px;" colspan="2">
                         <h1
                            style="letter-spacing: 0.5px;color: #ffffff;line-height: 1.3; text-transform: uppercase; margin: 0;">
                            Warm Greetings ! !
                         </h1>
                      </td>
    
                   </tr>
                
                </table>
    
             </td>
          </tr>
      
          <tr>
             <td style="padding: 30px 28px; ">
                <table style="width: 100%;">
                   <tr>
                      <td>
                         <h2 style="margin: 0;">Hi, ${name}</h2>
                      </td>
                   </tr>
                 
                   <tr>
                      <td style="padding-top: 15px; ">
                         <span style="margin: 0; font-weight: 400; font-size: 21px;">
                          Your Refferal point is created with ${points} points.
                         </span>
                         
    
                      </td>
                       </tr>
               
                   <tr>
                      <td style="padding-top: 0; color: #3c3c3c;">
                         <span style="margin: 0; font-weight: 400; font-size: 16px;">
                         </span>
    
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
      
         
      <!--body end-->
      
      <tr>
      <td>
        <table style=" width: 100%; padding-top: 20px;">
    
          <tr>
            <td align="center" style="padding-top: 20px">
              <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                <tbody>
                  <tr>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">I
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-14.665479,-157.42976)">
                            <g id="g16"
                              transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                              <g id="g14">
                                <circle id="circle10" data-original="#3B5998" r="56.098"
                                  cy="56.098" cx="56.098" style="fill:#3b5998" />
                                <path id="path12" className="active-path" data-original="#FFFFFF"
                                  d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                  style="fill:#ffffff" inkscape:connector-curvature="0" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                          <defs id="defs67" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata70">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-13.154175,-149.114)">
                            <g id="g83"
                              transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                              <g id="g81">
                                <circle id="circle75" className="" data-original="#55ACEE"
                                  r="56.098" cy="56.098" cx="56.098999"
                                  style="fill:#55acee" />
                                <g id="g79">
                                  <path id="path77" className="active-path"
                                    data-original="#F1F2F2"
                                    d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                    style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)"
                          sodipodi:docname="youtube-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-26.760715,-164.98928)">
                            <g id="g18"
                              transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                              <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                cx="256" style="fill:#d22215" />
                              <path id="path12" data-original="#A81411"
                                d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                style="fill:#a81411" inkscape:connector-curvature="0" />
                              <path id="path14" data-original="#FFFFFF"
                                d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                style="fill:#ffffff" inkscape:connector-curvature="0" />
                              <path id="path16" className="active-path" data-original="#D1D1D1"
                                d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                            </g>
                          </g>
                        </svg>
                      </p></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
              <span style="margin: 0; font-weight: 400; font-size: 13px;">
                Copyright 2024 <b>Offarat</b>
              </span>
            </td>
          </tr>
    
    
    
    
        </table>
      </td>
    </tr>
    
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
    </body>
    
    </html>`;
  },

  NOTIFY_COMPANY(deliveryCompany, OrderId) {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <title>Order Delivery Update</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
    
            body {
                font-family: 'Roboto', sans-serif;
            }
        </style>
    </head>
    
    <body style="background-color:#E6EEF2;color: #202020;padding: 50px 15px;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;">
        <br>
        <table style="max-width: 600px; background: #fff; margin: 0 auto; padding: 15px; height: 100%;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);">
            <tbody>
                <tr>
                      <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><b style="color: #da2a2c; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT </b></td>
                      <td style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right;">
                       ${moment(todayDate).format("DD-MMM-YYYY").toUpperCase()}
                      </td>
                   </tr>
                </table>
             </td>
                            </tr>
    
                            <!--- body start-->
                            <tr>
                                <td style="background-color: #da2a2c;" align="center">
                                    <table style="width: 100%; margin: 0 auto;">
                                        <tr>
                                            <td style="width: 100%; text-align: center; padding-top: 15px; padding-bottom:15px;" colspan="2">
                                                <h1 style="letter-spacing: 0.5px;color: #ffffff;line-height: 1.3; text-transform: uppercase; margin: 0;">
                                                    Important Update!
                                                </h1>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
    
                            <tr>
                                <td style="padding: 30px 28px;">
                                    <table style="width: 100%;">
                                        <tr>
                                            <td>
                                                <h2 style="margin: 0;">${deliveryCompany}</h2>
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td style="padding-top: 15px;">
                                                <span style="margin: 0; font-weight: 400; font-size: 21px;">
                                               In order ${OrderId} some items are not Deliverable. You will handle the delivery for those items.
                                                </span>
                                            </td>
                                        </tr>
    
                                    </table>
                                </td>
                            </tr>
                            <!--body end-->
    
                              <!--body end-->
          
          <tr>
          <td>
            <table style=" width: 100%; padding-top: 20px;">
        
              <tr>
                <td align="center" style="padding-top: 20px">
                  <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                    <tbody>
                      <tr>
                        <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                            target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                              xmlns:cc="http://creativecommons.org/ns#"
                              xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                              xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                              xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                              xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                              height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                              inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                              <defs id="defs2" />
                              <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                                borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                                inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                                inkscape:document-units="mm" inkscape:current-layer="layer1"
                                showgrid="false" inkscape:window-width="1680"
                                inkscape:window-height="1001" inkscape:window-x="0"
                                inkscape:window-y="25" inkscape:window-maximized="1" />
                              <metadata id="metadata5">I
                                <rdf:RDF>
                                  <cc:Work rdf:about="">
                                    <dc:format>image/svg+xml</dc:format>
                                    <dc:type
                                      rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                    <dc:title></dc:title>
                                  </cc:Work>
                                </rdf:RDF>
                              </metadata>
                              <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                                transform="translate(-14.665479,-157.42976)">
                                <g id="g16"
                                  transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                                  <g id="g14">
                                    <circle id="circle10" data-original="#3B5998" r="56.098"
                                      cy="56.098" cx="56.098" style="fill:#3b5998" />
                                    <path id="path12" className="active-path" data-original="#FFFFFF"
                                      d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                      style="fill:#ffffff" inkscape:connector-curvature="0" />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </p></td>
                        <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                            target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                              xmlns:cc="http://creativecommons.org/ns#"
                              xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                              xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                              xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                              xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                              height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                              inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                              <defs id="defs67" />
                              <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                                borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                                inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                                inkscape:document-units="mm" inkscape:current-layer="layer1"
                                showgrid="false" inkscape:window-width="1680"
                                inkscape:window-height="1001" inkscape:window-x="0"
                                inkscape:window-y="25" inkscape:window-maximized="1" />
                              <metadata id="metadata70">
                                <rdf:RDF>
                                  <cc:Work rdf:about="">
                                    <dc:format>image/svg+xml</dc:format>
                                    <dc:type
                                      rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                    <dc:title></dc:title>
                                  </cc:Work>
                                </rdf:RDF>
                              </metadata>
                              <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                                transform="translate(-13.154175,-149.114)">
                                <g id="g83"
                                  transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                                  <g id="g81">
                                    <circle id="circle75" className="" data-original="#55ACEE"
                                      r="56.098" cy="56.098" cx="56.098999"
                                      style="fill:#55acee" />
                                    <g id="g79">
                                      <path id="path77" className="active-path"
                                        data-original="#F1F2F2"
                                        d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                        style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </p></td>
                        <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                            <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                              xmlns:cc="http://creativecommons.org/ns#"
                              xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                              xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                              xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                              xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                              height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                              inkscape:version="0.92.3 (2405546, 2018-03-11)"
                              sodipodi:docname="youtube-1.svg">
                              <defs id="defs2" />
                              <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                                borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                                inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                                inkscape:document-units="mm" inkscape:current-layer="layer1"
                                showgrid="false" inkscape:window-width="1680"
                                inkscape:window-height="1001" inkscape:window-x="0"
                                inkscape:window-y="25" inkscape:window-maximized="1" />
                              <metadata id="metadata5">
                                <rdf:RDF>
                                  <cc:Work rdf:about="">
                                    <dc:format>image/svg+xml</dc:format>
                                    <dc:type
                                      rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                    <dc:title></dc:title>
                                  </cc:Work>
                                </rdf:RDF>
                              </metadata>
                              <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                                transform="translate(-26.760715,-164.98928)">
                                <g id="g18"
                                  transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                                  <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                    cx="256" style="fill:#d22215" />
                                  <path id="path12" data-original="#A81411"
                                    d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                    style="fill:#a81411" inkscape:connector-curvature="0" />
                                  <path id="path14" data-original="#FFFFFF"
                                    d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                    style="fill:#ffffff" inkscape:connector-curvature="0" />
                                  <path id="path16" className="active-path" data-original="#D1D1D1"
                                    d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                    style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </svg>
                          </p></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
                  <span style="margin: 0; font-weight: 400; font-size: 13px;">
                    Copyright 2024 <b>Offarat</b>
                  </span>
                </td>
              </tr>
       
        
            </table>
          </td>
        </tr>
        
         </table>
        </td>
        </tr>
        </tbody>
        </table>
        <br>
        </body>
        
        </html>`;
  },

  NOTIFY_CHANGE_PASSWORD(link) {
    return `<!DOCTYPE html>
    <html>
    
    <head>
       <title>Welcome</title>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    
       <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
    
          body {
             font-family: 'Roboto', sans-serif;
          }
       </style>
    </head>
    
    <body style="background-color:#E6EEF2;color: #202020;padding: 50px 15px;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;">
       <br>
       <table style="max-width: 600px; background: #fff; margin: 0 auto; padding: 15px; height: 100%;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);">
        <tbody><tr>
            <td>
       <table style=" padding:10px 0px 30px 0px ; width: 100%;background:#f7f7f7; border-spacing: 0;  font-family: 'Roboto', sans-serif;">
          <tr>
               <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><b style="color: #da2a2c; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT </b></td>
                      <td style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right;">
                       ${moment(todayDate).format("DD-MMM-YYYY").toUpperCase()}
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
    <tr>
       <td style="background-color: #da2a2c; " align="center">
          <table style="width: 100%; margin: 0 auto; ">
    
             <tr>
                <td style="width: 100%; text-align: center; padding-top: 15px; padding-bottom:15px;" colspan="2">
                   <h1 style="letter-spacing: 0.5px;color: #ffffff;line-height: 1.3; text-transform: uppercase; margin: 0;">
                      Warm Greetings ! !
                   </h1>
                </td>
    
             </tr>
    
          </table>
    
       </td>
    </tr>
    
    <tr>
       <td style="padding: 30px 28px 0px; ">
       
       
          <table style="width: 100%;">
             <tr>
                <td>
                   <h2 style="margin: 0;"> Password Change</h2>
                </td>
             </tr>
             <tr>
                <td style="padding-top: 25px; ">
                
                      Your password changed successfully, <br />
                use the below link and login
                  
    
                </td>
             </tr>
    
             <tr>
             <td  style="padding-top: 25px; ">
             <h3 style="text-align:center;"><a target="_blank" style="text-decoration:none;color:white;background-color: #da2a2c !important;" href =${link}>Click here </a> </h3>
          </td>
             </tr>
          </table>
       </td>
    </tr>
    
    
     <!--body end-->
      
     <tr>
      <td>
        <table style=" width: 100%; padding-top: 20px;">
    
          <tr>
            <td align="center" style="padding-top: 20px">
              <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                <tbody>
                  <tr>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-14.665479,-157.42976)">
                            <g id="g16"
                              transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                              <g id="g14">
                                <circle id="circle10" data-original="#3B5998" r="56.098"
                                  cy="56.098" cx="56.098" style="fill:#3b5998" />
                                <path id="path12" className="active-path" data-original="#FFFFFF"
                                  d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                  style="fill:#ffffff" inkscape:connector-curvature="0" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                          <defs id="defs67" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata70">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-13.154175,-149.114)">
                            <g id="g83"
                              transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                              <g id="g81">
                                <circle id="circle75" className="" data-original="#55ACEE"
                                  r="56.098" cy="56.098" cx="56.098999"
                                  style="fill:#55acee" />
                                <g id="g79">
                                  <path id="path77" className="active-path"
                                    data-original="#F1F2F2"
                                    d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                    style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)"
                          sodipodi:docname="youtube-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-26.760715,-164.98928)">
                            <g id="g18"
                              transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                              <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                cx="256" style="fill:#d22215" />
                              <path id="path12" data-original="#A81411"
                                d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                style="fill:#a81411" inkscape:connector-curvature="0" />
                              <path id="path14" data-original="#FFFFFF"
                                d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                style="fill:#ffffff" inkscape:connector-curvature="0" />
                              <path id="path16" className="active-path" data-original="#D1D1D1"
                                d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                            </g>
                          </g>
                        </svg>
                      </p></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
              <span style="margin: 0; font-weight: 400; font-size: 13px;">
                Copyright 2024 <b>Offarat</b>
              </span>
            </td>
          </tr>
    
    
    
    
        </table>
      </td>
    </tr>
    
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
    </body>
    
    </html>`;
  },

  REFUND_REQUEST(orderId) {
    return `<!DOCTYPE html>
    <html>
    
    <head>
       <title>Welcome</title>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

       <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
    
          body {
             font-family: 'Roboto', sans-serif;
          }
       </style>
    </head>
    
    <body style="background-color:#E6EEF2;color: #202020;padding: 50px 15px;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;">
       <br>
       <table style="max-width: 600px; background: #fff; margin: 0 auto; padding: 15px; height: 100%;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);">
        <tbody><tr>
            <td>
       <table style=" padding:10px 0px 30px 0px ; width: 100%;background:#f7f7f7; border-spacing: 0;  font-family: 'Roboto', sans-serif;">
          <tr>
               <td>
                <table style="width:100%; border-bottom: 1px solid #eee; padding: 0px 15px;">
                   <tr>
                      <td style="width: 50%; "><b style="color: #da2a2c; text-decoration: none; font-weight: 800;font-size: 20px;">OFFARAT </b></td>
                      <td style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right;">
                       ${moment(todayDate).format("DD-MMM-YYYY").toUpperCase()}
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
    
      <!--- body start-->
      <tr>
             <td style="background-color:#da2a2c; " align="center">
                <table style="width: 100%; margin: 0 auto; ">
    
                   <tr>
                      <td style="width: 100%; text-align: center; padding-top: 15px; padding-bottom:15px;" colspan="2">
                         <h1
                            style="letter-spacing: 0.5px;color: #ffffff;line-height: 1.3; text-transform: uppercase; margin: 0;">
                            Refund Request! 
                         </h1>
                      </td>
    
                   </tr>
                
                </table>
    
             </td>
          </tr>
      
          <tr>
             <td style="padding: 30px 28px; ">
                <table style="width: 100%;">
                   <tr>
                      <td style="padding-top: 15px; ">
                      <span style="margin: 0; font-weight: 400; font-size: 21px;">
                      You have received one refund request for order Id ${orderId}.Kindly approve this request and refund amount.
                      </span>
                      </td>
                       </tr>
               
                   <tr>
                      <td style="padding-top: 0; color: #3c3c3c;">
                         <span style="margin: 0; font-weight: 400; font-size: 16px;">
                         </span>
    
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
      
         
      <!--body end-->
      
      <tr>
      <td>
        <table style=" width: 100%; padding-top: 20px;">
    
          <tr>
            <td align="center" style="padding-top: 20px">
              <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                <tbody>
                  <tr>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="fb-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-102.57144" inkscape:cy="58.857137"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">I
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-14.665479,-157.42976)">
                            <g id="g16"
                              transform="matrix(0.08912974,0,0,0.08912974,14.665479,157.42976)">
                              <g id="g14">
                                <circle id="circle10" data-original="#3B5998" r="56.098"
                                  cy="56.098" cx="56.098" style="fill:#3b5998" />
                                <path id="path12" className="active-path" data-original="#FFFFFF"
                                  d="M 70.201,58.294 H 60.191 V 94.966 H 45.025 V 58.294 H 37.812 V 45.406 h 7.213 v -8.34 c 0,-5.964 2.833,-15.303 15.301,-15.303 L 71.56,21.81 v 12.51 h -8.151 c -1.337,0 -3.217,0.668 -3.217,3.513 v 7.585 h 11.334 z"
                                  style="fill:#ffffff" inkscape:connector-curvature="0" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none; margin-right: 15px;" href="#0"
                        target="_blank"> <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg73"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="tw-1.svg">
                          <defs id="defs67" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-108.288" inkscape:cy="38.856064"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata70">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-13.154175,-149.114)">
                            <g id="g83"
                              transform="matrix(0.08912974,0,0,0.08912974,13.154086,149.114)">
                              <g id="g81">
                                <circle id="circle75" className="" data-original="#55ACEE"
                                  r="56.098" cy="56.098" cx="56.098999"
                                  style="fill:#55acee" />
                                <g id="g79">
                                  <path id="path77" className="active-path"
                                    data-original="#F1F2F2"
                                    d="m 90.461,40.316 c -2.404,1.066 -4.99,1.787 -7.702,2.109 2.769,-1.659 4.894,-4.284 5.897,-7.417 -2.591,1.537 -5.462,2.652 -8.515,3.253 -2.446,-2.605 -5.931,-4.233 -9.79,-4.233 -7.404,0 -13.409,6.005 -13.409,13.409 0,1.051 0.119,2.074 0.349,3.056 -11.144,-0.559 -21.025,-5.897 -27.639,-14.012 -1.154,1.98 -1.816,4.285 -1.816,6.742 0,4.651 2.369,8.757 5.965,11.161 -2.197,-0.069 -4.266,-0.672 -6.073,-1.679 -0.001,0.057 -0.001,0.114 -0.001,0.17 0,6.497 4.624,11.916 10.757,13.147 -1.124,0.308 -2.311,0.471 -3.532,0.471 -0.866,0 -1.705,-0.083 -2.523,-0.239 1.706,5.326 6.657,9.203 12.526,9.312 -4.59,3.597 -10.371,5.74 -16.655,5.74 -1.08,0 -2.15,-0.063 -3.197,-0.188 5.931,3.806 12.981,6.025 20.553,6.025 24.664,0 38.152,-20.432 38.152,-38.153 0,-0.581 -0.013,-1.16 -0.039,-1.734 2.622,-1.89 4.895,-4.251 6.692,-6.94 z"
                                    style="fill:#f1f2f2" inkscape:connector-curvature="0" />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p></td>
                    <td align="center"><p style="text-decoration: none;" href="#0" target="_blank">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
                          xmlns:cc="http://creativecommons.org/ns#"
                          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                          xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
                          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="10mm"
                          height="10mm" viewBox="0 0 10 10" version="1.1" id="svg8"
                          inkscape:version="0.92.3 (2405546, 2018-03-11)"
                          sodipodi:docname="youtube-1.svg">
                          <defs id="defs2" />
                          <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666"
                            borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2"
                            inkscape:zoom="0.35" inkscape:cx="-148.28572" inkscape:cy="87.42855"
                            inkscape:document-units="mm" inkscape:current-layer="layer1"
                            showgrid="false" inkscape:window-width="1680"
                            inkscape:window-height="1001" inkscape:window-x="0"
                            inkscape:window-y="25" inkscape:window-maximized="1" />
                          <metadata id="metadata5">
                            <rdf:RDF>
                              <cc:Work rdf:about="">
                                <dc:format>image/svg+xml</dc:format>
                                <dc:type
                                  rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                                <dc:title></dc:title>
                              </cc:Work>
                            </rdf:RDF>
                          </metadata>
                          <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"
                            transform="translate(-26.760715,-164.98928)">
                            <g id="g18"
                              transform="matrix(0.01953125,0,0,0.01953125,26.760715,164.98928)">
                              <circle id="circle10" data-original="#D22215" r="256" cy="256"
                                cx="256" style="fill:#d22215" />
                              <path id="path12" data-original="#A81411"
                                d="m 384.857,170.339 c -7.677,2.343 -15.682,4.356 -23.699,6.361 -56.889,12.067 -132.741,-20.687 -165.495,32.754 -27.317,42.494 -35.942,95.668 -67.017,133.663 L 294.629,509.1 C 405.099,492.38 492.402,405.064 509.105,294.589 Z"
                                style="fill:#a81411" inkscape:connector-curvature="0" />
                              <path id="path14" data-original="#FFFFFF"
                                d="M 341.649,152.333 H 170.351 c -33.608,0 -60.852,27.245 -60.852,60.852 v 85.632 c 0,33.608 27.245,60.852 60.852,60.852 h 171.298 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z m -41.155,107.834 -80.12,38.212 c -2.136,1.019 -4.603,-0.536 -4.603,-2.901 v -78.814 c 0,-2.4 2.532,-3.955 4.67,-2.87 l 80.12,40.601 c 2.386,1.207 2.343,4.624 -0.067,5.772 z"
                                style="fill:#ffffff" inkscape:connector-curvature="0" />
                              <path id="path16" className="active-path" data-original="#D1D1D1"
                                d="m 341.649,152.333 h -87.373 v 78.605 l 46.287,23.455 c 2.384,1.208 2.341,4.624 -0.069,5.773 l -46.218,22.044 v 77.459 h 87.373 c 33.608,0 60.852,-27.245 60.852,-60.852 v -85.632 c 0,-33.607 -27.245,-60.852 -60.852,-60.852 z"
                                style="fill:#d1d1d1" inkscape:connector-curvature="0" />
                            </g>
                          </g>
                        </svg>
                      </p></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 0px;  line-height: 1;" align="center">
              <span style="margin: 0; font-weight: 400; font-size: 13px;">
                Copyright 2024 <b>Offarat</b>
              </span>
            </td>
          </tr>
    
    
    
    
        </table>
      </td>
    </tr>
    
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
    </body>
    
    </html>`;
  },
};
