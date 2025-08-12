export const SubAdminNodes = [
    {
        label: "Promotion Management",
        value: "promotionManagement",
        children: [
            { label: "Add", value: "promotionManagement.add" },
            { label: "Edit", value: "promotionManagement.edit" },
            { label: "Delete", value: "promotionManagement.delete" },
            { label: "View", value: "promotionManagement.view" },
            { label: "Active/In-active", value: "promotionManagement.active" },
        ],
    },
    {
        label: "Offer Management",
        value: "offerManagement",
        children: [
            { label: "Add", value: "offerManagement.add" },
            { label: "Edit", value: "offerManagement.edit" },
            { label: "Delete", value: "offerManagement.delete" },
            { label: "View", value: "offerManagement.view" },
            { label: "Active/In-active", value: "offerManagement.active" },
        ],
    },
    {
        label: "Customer Management",
        value: "usersManagement",
        path: "/sales-person",
        children: [
            {
                label: "Sales Person",
                value: "usersManagement.salesPerson",
                path: "/sales-person",
                children: [
                    { label: "Add", value: "usersManagement.salesPerson.add" },
                    { label: "Edit", value: "usersManagement.salesPerson.edit" },
                    { label: "Delete", value: "usersManagement.salesPerson.delete" },
                    { label: "View", value: "usersManagement.salesPerson.view" },
                    { label: "Active/In-active", value: "usersManagement.salesPerson.active" },
                ],
            },
            {
                label: "User  Person",
                value: "usersManagement.userPerson",
                path: "/customer-management",
                children: [
                    { label: "Add", value: "usersManagement.userPerson.add" },
                    { label: "Edit", value: "usersManagement.userPerson.edit" },
                    { label: "Delete", value: "usersManagement.userPerson.delete" },
                    { label: "View", value: "usersManagement.userPerson.view" },
                ],
            },
        ],
    },


    {
        label: "Classification Management",
        value: "classificationManagement",
        children: [
            { label: "Add", value: "classificationManagement.add" },
            { label: "Edit", value: "classificationManagement.edit" },
            { label: "Delete", value: "classificationManagement.delete" },
            { label: "View", value: "classificationManagement.view" },
            { label: "Active/In-active", value: "classificationManagement.active" },
        ],
    },



    {
        label: "Company Management",
        value: "companyManagement",
        path: "/delivery-company-management",

        children: [
            {
                label: "Delivery Company",
                value: "companyManagement.deliveryCompany",
                path: "/delivery-company-management",
                children: [
                    { label: "Add", value: "companyManagement.deliveryCompany.add" },
                    { label: "Edit", value: "companyManagement.deliveryCompany.edit" },
                    { label: "Delete", value: "companyManagement.deliveryCompany.delete" },
                    { label: "View", value: "companyManagement.deliveryCompany.view" },
                    { label: "Active/In-active", value: "companyManagement.deliveryCompany.active" },
                ],
            },
            {
                label: "Company",
                value: "companyManagement.company",
                path: "/company-management",
                children: [
                    { label: "Add", value: "companyManagement.company.add" },
                    { label: "Edit", value: "companyManagement.company.edit" },
                    { label: "Delete", value: "companyManagement.company.delete" },
                    { label: "View", value: "companyManagement.company.view" },
                    { label: "Active/In-active", value: "companyManagement.company.active" },
                ],
            },
            {
                label: "Branch",
                value: "companyManagement.branch",
                path: "/branch-management",
                children: [
                    { label: "Add", value: "companyManagement.branch.add" },
                    { label: "Edit", value: "companyManagement.branch.edit" },
                    { label: "Delete", value: "companyManagement.branch.delete" },
                    { label: "View", value: "companyManagement.branch.view" },
                    { label: "Active/In-active", value: "companyManagement.branch.active" },
                ],
            },
            {
                label: "Account Information",
                value: "companyManagement.accountInformation",
                path: "/account-information",
                children: [
                    { label: "Add", value: "companyManagement.accountInformation.add" },
                    { label: "Edit", value: "companyManagement.accountInformation.edit" },
                    { label: "Delete", value: "companyManagement.accountInformation.delete" },
                    { label: "View", value: "companyManagement.accountInformation.view" },
                ],
            },
        ],
    },

    {
        label: "Product Management",
        value: "productManagement",
        children: [
            { label: "Add", value: "productManagement.add" },
            { label: "Edit", value: "productManagement.edit" },
            { label: "Delete", value: "productManagement.delete" },
            { label: "View", value: "productManagement.view" },
            { label: "Active/In-active", value: "productManagement.active" },
        ],
    },


    {
        label: "Order Management",
        value: "orderManagement",
        children: [
            { label: "Add", value: "orderManagement.add" },
            { label: "Edit", value: "orderManagement.edit" },
            { label: "Delete", value: "orderManagement.delete" },
            { label: "View", value: "orderManagement.view" },
            { label: "Active/In-active", value: "orderManagement.active" },
        ],
    },


    {
        label: "Reports Management",
        value: "reportsManagement",
        path: "/reports",
        children: [
            {
                label: "Order Reports",
                value: "reportsManagement.orderReports",
                path: "/reports",
                children: [
                    { label: "Download", value: "reportsManagement.orderReports.download" },
                  
                ],
            },
            {
                label: "General Reports",
                value: "reportsManagement.generalReports",
                path: "/general-reports",
                children: [
                    { label: "Download", value: "reportsManagement.generalReports.download" },
                
                ],
            },
            {
                label: "In-Active Reports",
                value: "reportsManagement.inactiveReports",
                path: "/in-active-reports",
                children: [
                    { label: "Download", value: "reportsManagement.inactiveReports.download" },
                   
                ],
            },
            {
                label: "User Reports",
                value: "reportsManagement.userReports",
                path: "/user-reports",
                children: [
                    { label: "Download", value: "reportsManagement.userReports.download" },
                  
                ],
            },

            {
                label: "Item Available",
                value: "reportsManagement.itemAvailable",
                path: "/Item-available",
                children: [
                    { label: "Download", value: "reportsManagement.itemAvailable.download" },
                   
                ],
            },


            {
                label: "Supplier Monthly Report",
                value: "reportsManagement.supplierMonthlyReport",
                path: "/supplier-monthly-report",
                children: [
                    { label: "Download", value: "reportsManagement.supplierMonthlyReport.download" },
                ],
            },

            {
                label: "Coupon Reports",
                value: "reportsManagement.couponReports",
                path: "/coupon-report",
                children: [
                    { label: "Download", value: "reportsManagement.couponReports.download" },
                  
                ],
            },

            {
                label: "Refund Reports",
                value: "reportsManagement.refundReports",
                path: "/refund-report",
                children: [
                    { label: "Download", value: "reportsManagement.refundReports.download" },
                    
                ],
            },


            {
                label: "Spin Reports",
                value: "reportsManagement.spinReports",
                path: "/spin-report",
                children: [
                    { label: "Download", value: "reportsManagement.spinReports.download" },
                   
                ],
            },

            // {
            //     label: "Account Statement",
            //     value: "reportsManagement.accountStatement",
            //     path: "/account-statement",
            //     children: [
            //         { label: "Download", value: "reportsManagement.accountStatement.download" },
                  
            //     ],
            // },

        ],
    },





    {
        label: "Transaction Management",
        value: "transactionManagement",
        path: "/transaction-management",
        children: [
            {
                label: "Transactions",
                value: "transactionManagement.transactions",
                path: "/transaction-management",
                children: [
                    { label: "View", value: "transactionManagement.transactions.view" },
                ],
            },
            {
                label: "Refund",
                value: "transactionManagement.refund",
                path: "/refund",
                children: [
                    { label: "View", value: "transactionManagement.refund.view" },
                ],
            },

        ],
    },




    {
        label: "Fortune Management",
        value: "fortuneManagement",
        path: "/fortune-spin",
        children: [
            {
                label: "Fortune Spin",
                value: "fortuneManagement.fortuneSpin",
                path: "/fortune-spin",
                children: [
                    { label: "Add", value: "fortuneManagement.fortuneSpin.add" },
                    { label: "Edit", value: "fortuneManagement.fortuneSpin.edit" },
                    { label: "Delete", value: "fortuneManagement.fortuneSpin.delete" },
                    { label: "View", value: "fortuneManagement.fortuneSpin.view" },
                ],
            },
            {
                label: "Fortune Settings",
                value: "fortuneManagement.fortuneSettings",
                path: "/fortune-settings",
                children: [
                    { label: "Add", value: "fortuneManagement.fortuneSettings.add" },
                    { label: "Edit", value: "fortuneManagement.fortuneSettings.edit" },
                    { label: "Delete", value: "fortuneManagement.fortuneSettings.delete" },
                    { label: "View", value: "fortuneManagement.fortuneSettings.view" },
                ],
            },

        ],
    },





    {
        label: "Settings",
        value: "settings",
        path: "/banner-management",
        children: [
            {
                label: "Banner Management",
                value: "settings.bannerManagement",
                path: "/banner-management",
                children: [
                    { label: "Add", value: "settings.bannerManagement.add" },
                    { label: "Edit", value: "settings.bannerManagement.edit" },
                    { label: "Delete", value: "settings.bannerManagement.delete" },
                    { label: "View", value: "settings.bannerManagement.view" },
                ],
            },
            {
                label: "Dynamic Label",
                value: "settings.dynamicLabel",
                path: "/dynamic-label",
                children: [
                    { label: "Add", value: "settings.dynamicLabel.add" },
                    { label: "Edit", value: "settings.dynamicLabel.edit" },
                    { label: "Delete", value: "settings.dynamicLabel.delete" },
                    { label: "View", value: "settings.dynamicLabel.view" },
                ],
            },

            {
                label: "Content Management",
                value: "settings.contentManagement",
                path: "/content-management",
                children: [
                    { label: "Add", value: "settings.contentManagement.add" },
                    { label: "Edit", value: "settings.contentManagement.edit" },
                    { label: "Delete", value: "settings.contentManagement.delete" },
                    { label: "View", value: "settings.contentManagement.view" },
                ],
            },


            {
                label: "Testimonial Management",
                value: "settings.testimonialManagement",
                path: "/testimonial-management",
                children: [
                    { label: "Add", value: "settings.testimonialManagement.add" },
                    { label: "Edit", value: "settings.testimonialManagement.edit" },
                    { label: "Delete", value: "settings.testimonialManagement.delete" },
                    { label: "View", value: "settings.testimonialManagement.view" },
                ],
            },

            {
                label: "Faq Management",
                value: "settings.faqManagement",
                path: "/faq-management",
                children: [
                    { label: "Add", value: "settings.faqManagement.add" },
                    { label: "Edit", value: "settings.faqManagement.edit" },
                    { label: "Delete", value: "settings.faqManagement.delete" },
                    { label: "View", value: "settings.faqManagement.view" },
                ],
            },


            {
                label: "Manual Notification",
                value: "settings.manualNotification",
                path: "/manual-notifications",
                children: [
                    { label: "Add", value: "settings.manualNotification.add" },
                    { label: "Edit", value: "settings.manualNotification.edit" },
                    { label: "Delete", value: "settings.manualNotification.delete" },
                    { label: "View", value: "settings.manualNotification.view" },
                ],
            },

            // {
            //     label: "Contact Us",
            //     value: "settings.contactUs",
            //     path: "/contact-us",
            //     children: [
            //         // { label: "Add", value: "settings.contactUs.add" },
            //         // { label: "Edit", value: "settings.contactUs.edit" },
            //         { label: "Delete", value: "settings.contactUs.delete" },
            //         { label: "View", value: "settings.contactUs.view" },
            //     ],
            // },



            {
                label: "Dynamic Question",
                value: "settings.dynamicQuestion",
                path: "/dynamic-form",
                children: [
                    { label: "Add", value: "settings.dynamicQuestion.add" },
                    { label: "Edit", value: "settings.dynamicQuestion.edit" },
                    { label: "Delete", value: "settings.dynamicQuestion.delete" },
                    { label: "View", value: "settings.dynamicQuestion.view" },
                ],
            },



            // {
            //     label: "SMTP Credentials",
            //     value: "settings.smtp",
            //     path: "/smtp",
            //     children: [
            //         { label: "Add", value: "settings.smtp.add" },
            //         { label: "Edit", value: "settings.smtp.edit" },
            //         { label: "Delete", value: "settings.smtp.delete" },
            //         { label: "View", value: "settings.smtp.view" },
            //     ],
            // },



            // {
            //     label: "Twillio Credentials",
            //     value: "settings.twillio",
            //     path: "/twillio",
            //     children: [
            //         { label: "Add", value: "settings.twillio.add" },
            //         { label: "Edit", value: "settings.twillio.edit" },
            //         { label: "Delete", value: "settings.twillio.delete" },
            //         { label: "View", value: "settings.twillio.view" },
            //     ],
            // },


            // {
            //     label: "App Version",
            //     value: "settings.appVersion",
            //     path: "/app-version",
            //     children: [
            //         { label: "Add", value: "settings.appVersion.add" },
            //         { label: "Edit", value: "settings.appVersion.edit" },
            //         { label: "Delete", value: "settings.appVersion.delete" },
            //         { label: "View", value: "settings.appVersion.view" },
            //     ],
            // },







        ],
    },

];