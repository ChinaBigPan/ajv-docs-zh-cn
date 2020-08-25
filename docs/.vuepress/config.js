module.exports= {
    title: 'Ajv',
    description: "Ajv: Another JSON Schema Validator。Node.js和浏览器中最快速的JSON Schema验证器。",
    base: "/ajv-docs-cn/",
    markdown: {
        lineNumbers: true,
        anchor: {
            permalink: false
        }
    },
    themeConfig: {
        activeHeaderLinks: true,
        displayAllHeaders: true,
        nav: [
            // {
            //     text: "主站",
            //     link: "http://www.febeacon.com"
            // },
            {
                text: "文档首页",
                link: "/"
            }
        ],
        sidebar: [
            {
                title: 'Ajv',
                path: '/routes/',
                sidebarDepth: 2
            },
            {
                title: "验证",
                path: 'routes/validation',
                sidebarDepth: 2
            },
            {
                title: "Ajv-cli",
                path: '/routes/cli',
                sidebarDepth: 2 
            },
            {
                title: "Ajv-pack",
                path: '/routes/pack',
                sidebarDepth: 2
            },
            {
                title: "Ajv-keywords",
                path: '/routes/keywords',
                sidebarDepth: 2
            }
        ]
    },
    head: [
        ["link", {
            rel: "icon", href: "/images/favicon.ico"
        }]
    ]
}