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
                title: 'Logo写了吗',
                path: '/routes/',
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