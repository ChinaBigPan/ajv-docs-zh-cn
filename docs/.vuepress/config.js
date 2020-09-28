function getBasicSideBar() {
    return [
        "",
        "validation",
        "custom",
        "coercion"
    ]
}

function getAPISideBar() {
    return ["api", "options", "validation_errors", "plugins"]
}

function getPackagesSideBar() {
    return [
        "",
        "async",
        "bsontype",
        "cli",
        "errors",
        "i18n",
        "istanbul",
        "keywords",
        "merge_patch",
        "pack",
        "formats-draft2019"
    ]
}


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
        displayAllHeaders: false,
        nav: [
            // {
            //     text: "主站",
            //     link: "http://www.febeacon.com"
            // },
            {
                text: "文档首页",
                link: "/"
            },
            {
                text: "API和配置项",
                link: "/routes/api/api"
            },
            {
                text: "相关扩展包",
                link: "/routes/packages/"
            }
        ],
        sidebar: {
            "/routes/basic/": getBasicSideBar(),
            "/routes/api/": getAPISideBar(),
            "/routes/packages/": getPackagesSideBar()
        }
    },
    head: [
        ["link", {
            rel: "icon", href: "/images/favicon.ico"
        }]
    ]
}