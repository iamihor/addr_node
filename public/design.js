
webix.ready(function () {

    function UserHandler(id) {
//https://docs.webix.com/api__ui.button_click_config.html        
//        webix.message("Click on button " + id);
//https://docs.webix.com/helpers__ajax_operations.html
//https://docs.webix.com/desktop__loadingerror.html
        webix.ajax("/user").then(function (data) {
//    console.log(data.json());
//    console.log(data.json().code);
            var response = JSON.parse(data.text());
            webix.message({
                text: "Hello " + response.message,
                type: "success"
            });
            if (response.code == 200) {
                $$("btAdd").show();
                $$("dtAddr").showColumn("btEdit");
            } else {
                webix.message({
                    text: "Hello, good bye.",
                    type: "error"
                });
            }
        }, function (err) {
            var response = JSON.parse(err.response);
            webix.message({
                type: 'error',
                text: "Hello " + response.message
            });
        });

    }

    function ExportHandler() {
//https://docs.webix.com/desktop__data_components_export.html
//https://docs.webix.com/datatable__exporttoexcel.html
        webix.toExcel($$("dtAddr"), {
            filename: "AddressBook", // for filename
            name: "AddressBook" // for sheet name
        });
//        https://docs.webix.com/desktop__message_boxes.html        
        webix.message({
            text: "Експортовано у новий файл AddressBook.xls!",
            type: "success"
        });
    }

    function AddHandler() {
        $$("vwEdit").show();
        $$("fmEdit").setValues({
            'txId': '',
            'txName': '',
            'txDep': '',
            'txPos': '',
            'txEmail': '',
            'txWork': '',
            'txMob': '',
            'selPlace': ''
        });
        $$("btDelete").hide();
    }

    function SaveHandler(values) {
        var values = $$("fmEdit").getValues();
//        webix.message(values.txName);
        if (values.txName.length === 0) {
            webix.alert("Не вказано Прізвище ІБ.");
            return false;
        }
//        webix.message ("Save");
        webix.ajax().post("/data", values).then(function (data) {
//                    webix.message(data.text());
//            console(data.text());
//            webix.message("<pre>" + JSON.stringify(data, 0, 1) + "</pre>");
            webix.message({
                text: "Збережено інформацію для " + values.txName,
                type: "info"
            });
            $$("dtAddr").clearAll();
            $$("dtAddr").load("/data");
            $$("vwEdit").hide();
        }, function (err) {
            webix.message({
                text: err.message,
                type: "error"
            });
        });
//        this.getTopParentView().hide();
//        $$("fmEdit").hide();
//        $$("vwEdit").hide();
    }

    function DelHandler(id) {
//https://docs.webix.com/desktop__message_boxes.html#confirm
        id = $$("txId").getValue();
        webix.confirm("Бажаєте видалити для " + $$("txName").getValue() + " ?").then(function (result) {
            webix.ajax().del("/data", {id: id}).then(function (data) {
//                console.log(data.text());
                webix.message({
                    text: "Видалено інформацію для " + $$("txName").getValue(),
                    type: "info"
                });
                $$("dtAddr").clearAll();
                $$("dtAddr").load("/data");
                $$("vwEdit").hide();
            }, function (err) {
                webix.message({
                    text: err.message,
                    type: "error"
                });
            }).fail(function () {
                return;
                // webix.message("Cancel");
            });
        });
    }

    var myEdit = webix.ui({
        view: "window",
        id: "vwEdit",
        head: "Редагування.. ",
        modal: true,
        position: 'center',
        autowidth: true,
        autoheight: true,
        move: true,
        body: {
            "view": "form",
            "margin": 30,
            "id": "fmEdit",
            "rows": [
                {
                    "rows": [
                        {"view": "text", id: "txId", name: "txId", hidden: true},
                        {"view": "text", "id": "txName", "name": "txName", "label": "Прізвище ІБ", "height": 38, "width": 800},
                        {
                            "cols": [
                                {"view": "text", "label": "Підрозділ", "id": "txDep", "name": "txDep"},
                                {"view": "text", "label": "Посада", "id": "txPos", "name": "txPos"}
                            ]
                        },
                        {
                            "cols": [
                                {"label": "Роб.Телефон", "view": "text", "id": "txWork", "name": "txWork"},
                                {"label": "Моб.Телефон", "view": "text", "id": "txMob", "name": "txMob"}
                            ]
                        },
                        {
                            "cols": [
                                {"label": "eMail", "view": "text", "id": "txEmail", "name": "txEmail"},
                                {"label": "Тер",
                                    "view": "richselect",
                                    "id": "selPlace",
                                    "name": "selPlace",
// https://snippet.webix.com/301c2d85
// https://docs.webix.com/desktop__advanced_combo.html
                                    options: {
                                        view: "suggest",
                                        body: {
                                            template: "#placename#",
                                            url: "/group"
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "height": 38,
                    "cols": [
                        {"view": "button",
                            "label": "Вихід",
                            "id": "btCancel",
                            "css": "webix_primary",
                            "align": "right",
                            "width": 120,
                            click: function (id, event) {
//                                webix.message($$("selPlace").getValue());
                                this.getTopParentView().hide();
                            }},
                        {
                            "view": "button",
                            "css": "webix_transparent",
                            "label": "Зберегти",
                            "id": "btSave",
                            "align": "right",
                            "width": 120,
// https://docs.webix.com/desktop__form.html#retrievingformvalues                            
                            click: function (id, event) {
                                SaveHandler();

                            }
                        },
                        {"view": "template", "template": "", "role": "placeholder", "borderless": true},
                        {"label": "Видалити",
                            "id": "btDelete",
                            "view": "button",
                            "css": "webix_transparent",
                            "width": 120,
// https://docs.webix.com/desktop__form.html#retrievingformvalues                            
                            click: function (id, event) {
                                DelHandler();
                            }
                        }
                    ]
                }
            ]
        }});
    if (webix.CustomScroll)
        webix.CustomScroll.init();
    webix.ui({
        "type": "wide",
        "rows": [
            {
                "view": "toolbar",
                "css": "webix_dark",
                "padding": {
                    "right": 10,
                    "left": 10
                },
                "elements": [
                    {
                        "height": 0,
                        "cols": [
                            {
                                "view": "label",
                                "label": "Довідник адрес",
                                "align": "left",
                                "height": 0
                            },
                            {
                                "icon": "wxi-search",
                                "view": "icon",
                                "height": 0,
                                "hidden": true
                            },
                            {
                                "icon": "wxi-plus",
                                "id": "btAdd",
                                "view": "icon",
                                "height": 0,
                                "hidden": true,
                                click: AddHandler
                            },
                            {
                                "icon": "wxi-download",
                                "id": "btExport",
                                "view": "icon",
                                "height": 0,
                                click: ExportHandler
                            },
                            {
                                "icon": "wxi-user",
                                "id": "btUser",
                                "view": "icon",
                                "height": 0,
                                click: UserHandler
                            }
                        ]
                    }
                ],
                "height": 38
            },
            {
                "rows": [
                    {
//https://docs.webix.com/datatable__filtering.html
                        "view": "datatable",
                        "id": "dtAddr",
                        "css": "webix_dark",
                        "resizeColumn": true,
                        "fixedRowHeight": false,
                        "columns": [
                            {
                                "id": "id",
                                "header": "id",
                                "hidden": true
                            },
                            {
                                "id": "name",
                                "header": ["Прізвище ІБ", {content: "textFilter"}],
                                "fillspace": true,
                                "sort": "string",
                                "hidden": false
                            },
                            {
                                "id": "company",
                                "header": ["Підрозділ", {content: "selectFilter"}],
                                "sort": "string",
                                "fillspace": 1,
                                "hidden": false
                            },
                            {
                                "id": "title",
                                "header": ["Посада", {content: "textFilter"}],
                                "sort": "string",
                                "fillspace": 1,
                                "hidden": false
                            },
                            {
                                "id": "email",
                                "header": ["Email", {content: "textFilter"}],
                                "sort": "string",
                                "fillspace": 1,
                                "hidden": false
                            },
                            {
                                "id": "work",
                                "header": ["Роб.Телефон", {content: "textFilter"}],
                                "sort": "string",
                                "fillspace": 0.5,
                                "hidden": false
                            },
                            {
                                "id": "mobile",
                                "header": ["Моб.Телефон", {content: "textFilter"}],
                                "sort": "string",
                                "fillspace": 1,
                                "autowidth": true,
                                "hidden": false
                            },
                            {
                                "id": "placename",
                                "header": ["Тер.", {content: "selectFilter"}],
                                "fillspace": 0.5,
                                "sort": "string",
                                "hidden": false
                            },
                            {
                                "id": "btEdit",
                                "header": "",
                                template: "<span class='webix_icon wxi-pencil'></span>",
                                "fillspace": 0.5,
                                "hidden": true
                            }
                        ],
                        "select": true,
                        "url": "/data",
                        "scrollX": false,
                        "height": 0,
                        ready() {
                            webix.message({
                                text: `Завантажено ${this.count()} записів!`,
                                type: "success"
                            });
                        },
                        onClick: {"wxi-pencil": function (event, cell, node) {
                                item = this.getItem(cell);
                                $$("vwEdit").show();
                                $$("fmEdit").setValues({
                                    'txId': item.id,
                                    'txName': item.name,
                                    'txDep': item.company,
                                    'txPos': item.title,
                                    'txEmail': item.email,
                                    'txWork': item.work,
                                    'txMob': item.mobile,
                                    'selPlace': item.placeid
                                });
//                                webix.message(item.placeid + item.placename);
                            }
                        }
                    }
                ],
                "height": 0
            }
        ]
    });
});