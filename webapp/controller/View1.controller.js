sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/TextArea",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/ui/core/Core"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, JSONModel, Fragment, Filter, FilterOperator, MessageBox, MessageToast, History, ValueHelpDialog,Dialog,
        DialogType,Label,Text,TextArea,Button,ButtonType,Core) {
        "use strict";

        return Controller.extend("com.pgr.suspence.project1pgr.controller.View1", {
            onInit: function () {
                // this.clientDatacall();
            },
            clientDatacall: function () {
                debugger;
                var that = this;
                var json = new JSONModel();
                this.getOwnerComponent().getModel().read("/ETS_VH_PLANT", {
                    success: function (res) {
                        debugger;
                        // that.getView().setBusy(false);
                        that.plantdata = res.results;
                        json.setData({
                            Plants: res.results

                        });

                    },
                    error: function (oError) {
                        debugger;
                        var obj = JSON.parse(oError.responseText).error.message;
                        MessageBox.error(obj.value + '\n');
                    }
                });

            },
            handleClientCenterValueHelp: function (oEvent) {


                var that = this;
                var model = new sap.ui.model.json.JSONModel();
                var userData = that.getView().byId("client_id").getValue();


                var oValueHelpDialog = new ValueHelpDialog({
                    basicSearchText: userData,
                    title: "Plant",
                    supportMultiselect: false,
                    supportRanges: false,
                    supportRangesOnly: false,
                    key: "Plant",
                    descriptionKey: "Description",
                    stretch: sap.ui.Device.system.phone,

                    ok: function (oControlEvent) {
                        var aTokens = oControlEvent.getParameter("tokens");
                        var idCustomer = that.getView().byId("client_id");
                        var selectedRow = aTokens[0].getCustomData()[0].getValue();
                        idCustomer.setValue(selectedRow.Description + "-" + selectedRow.Plant);
                        // idCustomer.setValue(selectedRow.Plant);
                        // idCustomer.setTokens(aTokens);

                        oValueHelpDialog.close();
                    },

                    cancel: function (oControlEvent) {
                        //	sap.m.MessageToast.show("Cancel pressed!");
                        oValueHelpDialog.close();
                    },

                    afterClose: function () {
                        oValueHelpDialog.destroy();
                    }
                });

                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [{
                        label: "Plant",
                        template: "Plant"
                    }, {
                        label: "Description",
                        template: "Description",
                        demandPopin: true
                    }]
                });
                oValueHelpDialog.getTable().setModel(oColModel, "columns");
                var oFilter = [];
                var idCustomer = that.getView().byId("client_id").getValue();

                sap.ui.core.BusyIndicator.show();
                this.oValueHelpDialog = oValueHelpDialog;



                var ccFilter = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, userData);

                oFilter.push(ccFilter);

                that.getOwnerComponent().getModel().read("/ETS_VH_PLANT", {
                    filters: oFilter,
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        var UserProfile = new sap.ui.model.json.JSONModel();

                        UserProfile.setData(oData.results);
                        that.oValueHelpDialog.getTable().setModel(UserProfile);

                        if (that.oValueHelpDialog.getTable().bindRows) {
                            that.oValueHelpDialog.getTable().bindRows("/");
                            that.oValueHelpDialog.getTable().bindAggregation("rows", "/");
                        } else if (that.oValueHelpDialog.getTable().bindItems) {
                            that.oValueHelpDialog.getTable().bindAggregation("items", "/", function (sId, oContext) {
                                var aCols = that.oValueHelpDialog.getTable().getModel("columns").getData().cols;
                                return new sap.m.ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        var colname = column.template;
                                        return new sap.m.Label({
                                            text: "{" + colname + "}"
                                        });
                                    })
                                });
                            });
                        }

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                    }
                });

                var idCustomer = this.getView().byId("client_id").getValue();

                var oBinding = oValueHelpDialog.getTable().getBinding("items");
                if (!oBinding) {
                    oBinding = oValueHelpDialog.getTable().getBinding("rows");
                }


                var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                    advancedMode: true,
                    filterBarExpanded: true,
                    showGoOnFB: !sap.ui.Device.system.phone,
                    filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({
                        groupTitle: "foo",
                        groupName: "gn1",
                        name: "n1",
                        label: "Plant",
                        control: new sap.m.Input()
                    }),
                    new sap.ui.comp.filterbar.FilterGroupItem({
                        groupTitle: "foo",
                        groupName: "gn1",
                        name: "n2",
                        label: "Plant Description",
                        control: new sap.m.Input()
                    })

                    ],
                    search: function (event) {
                        var searchValue = this._oBasicSearchField.getValue();
                        //	var oText = arguments[0].mParameters.selectionSet[0].getValue();
                        var arrList = this._mAdvancedAreaFilter.gn1.items;

                        var plant, plant_Desc, fplant, fplant_Desc;
                        var oSearchFilter = [];

                        plant = arrList[0].control.getProperty("value");
                        if (plant === "" && searchValue !== "") {
                            plant = searchValue;
                        }

                        if (plant) {
                            fplant = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, plant);
                        }

                        plant_Desc = arrList[1].control.getProperty("value");

                        if (plant_Desc) {
                            fplant_Desc = new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.EQ, plant_Desc);
                            //	oBinding.filter(oFilter);
                        }

                        var oBinding = oValueHelpDialog.getTable().getBinding("items");
                        if (!oBinding) {
                            oBinding = oValueHelpDialog.getTable().getBinding("rows");
                        }

                        if (plant !== "" && plant_Desc !== "") {

                            if (oBinding) {

                                oSearchFilter.push(fplant);
                                oSearchFilter.push(fplant_Desc);

                                that.FetchCustomerList(oSearchFilter);
                            }
                        } else if (plant) {
                            if (oBinding) {

                                oSearchFilter.push(fplant);
                                that.FetchCustomerList(oSearchFilter);
                            }
                        } else if (plant_Desc) {
                            if (oBinding) {

                                oSearchFilter.push(fplant_Desc);
                                that.FetchCustomerList(oSearchFilter);
                            }
                        } else {

                            that.FetchCustomerList(oSearchFilter);
                        }
                    }
                });

                if (oFilterBar.setBasicSearch) {
                    oFilterBar.setBasicSearch(new sap.m.SearchField({
                        showSearchButton: sap.ui.Device.system.phone,
                        placeholder: "Search",
                        search: function (event) {
                            oValueHelpDialog.getFilterBar().search();
                        }
                    }));
                }
                oValueHelpDialog.setFilterBar(oFilterBar);
                oValueHelpDialog.open();
                //	oValueHelpDialog.update();

            },
            FetchCustomerList: function (oFilter) {
                var that = this;
                var urlPath, urlParameters;
                if (oFilter.length === 0) {
                    // urlPath = "/ETS_VH_PLANT?$top=50";
                    // urlParameters = "$top=50";
                    urlPath = "/ETS_VH_PLANT";
                    urlParameters = "";
                } else {
                    urlPath = "/ETS_VH_PLANT";
                    urlParameters = "";
                }
                that.getOwnerComponent().getModel().read(urlPath, {
                    filters: oFilter,
                    urlParameters: urlParameters,
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        var UserProfile = new sap.ui.model.json.JSONModel();

                        UserProfile.setData(oData.results);
                        that.oValueHelpDialog.getTable().setModel(UserProfile);

                        if (that.oValueHelpDialog.getTable().bindRows) {
                            that.oValueHelpDialog.getTable().bindRows("/");
                            that.oValueHelpDialog.getTable().bindAggregation("rows", "/");
                        } else if (that.oValueHelpDialog.getTable().bindItems) {
                            that.oValueHelpDialog.getTable().bindAggregation("items", "/", function (sId, oContext) {
                                var aCols = that.oValueHelpDialog.getTable().getModel("columns").getData().cols;
                                return new sap.m.ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        var colname = column.template;
                                        return new sap.m.Label({
                                            text: "{" + colname + "}"
                                        });
                                    })
                                });
                            });
                        }

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            },
            onSearch: function () {
                debugger;

                var that = this;
                var oBusyDialog = new sap.m.BusyDialog({});
                var oTable = this.getView().byId("table1").setVisible(true);

                var filters = [];
                // if(that.MarkReprocess){
                //     var SelRows= this.getView().byId("table1").getSelectedIndices();
                //     for(var i=0;i<SelRows.length;i++){
                //         this.getView().byId("table1").getRow()[SelRows[i]].setSelectedIndex(-1);
                //     }
                // }
                if (this.getView().byId("client_id").getValue()) {
                    var oCoCode = this.getView().byId("client_id").getValue().split("-")[1];
                } else {
                    var oCoCode = this.getView().byId("client_id").getValue();
                }
                var date_id = this.getView().byId("date_id").getDateValue();
                var date_id2 = this.getView().byId("date_id").getSecondDateValue();
                var json = new JSONModel();

                if (oCoCode === "" && date_id === null) {


                    var json = new JSONModel();

                    this.getOwnerComponent().getModel().read("/ETS_MATERIAL_DOCUMENT_HEADER", {
                        filters: filters,
                        success: function (res) {
                            debugger;
                            // that.getView().setBusy(false);
                            // var oModel = new sap.ui.model.json.JSONModel(res);
                            json.setData({
                                tabledata_res: res.results
                            });
                            that.getView().setModel(json, "TableData");
                            that.getView().getModel("TableData").refresh();

                        },
                        error: function (oError) {
                            var obj = JSON.parse(oError.responseText).error.message;
                            MessageBox.error(obj.value + '\n');
                        }
                    });
                    //	this.RefreshView(filters);
                } else {

                    //	var sQuery = OEvent.getSource().getValue();

                    var CoCodeFilter = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, oCoCode);
                    // var oDate = new sap.ui.model.Filter("Coordinator", sap.ui.model.FilterOperator.EQ, oCordinator);
                    // var caseIdFilter = new sap.ui.model.Filter("ExtKey", sap.ui.model.FilterOperator.EQ, oCaseId);
                    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd'T'HH:mm:ss" });
                    var dateFormattedFrom = dateFormat.format(date_id);
                    var dateFormattedTo = dateFormat.format(date_id2);

                    var dateFormatCompareFrom = new Date(date_id);
                    var dateFormatCompareTo = new Date(date_id2);
                    if (dateFormatCompareFrom.getDay() === dateFormatCompareTo.getDay()) {
                        var date_idFilter = new sap.ui.model.Filter("CreatedOn", sap.ui.model.FilterOperator.EQ, dateFormattedFrom);
                    } else {
                        date_idFilter = new sap.ui.model.Filter("CreatedOn", sap.ui.model.FilterOperator.BT, dateFormattedFrom, dateFormattedTo);
                    }
                    // var companycodeFilter = new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.EQ, oCompanyCode); //FETR1529233 - new Line
                    if (oCoCode !== "") {
                        filters.push(CoCodeFilter);
                    }

                    if (date_id !== "" && date_id != null) {
                        filters.push(date_idFilter);
                    }
                    //aGlobalFilters = filters.slice(); //Lazy Loading 
                    //	this.RefreshView(filters);
                    this.getOwnerComponent().getModel().read("/ETS_MATERIAL_DOCUMENT_HEADER", {
                        filters: filters,
                        success: function (res) {
                            debugger;
                            // that.getView().setBusy(false);
                            // var oModel = new sap.ui.model.json.JSONModel(res);
                            // that.getView().setModel(oModel, "TableData");
                            json.setData({
                                tabledata_res: res.results
                            });
                            that.getView().setModel(json, "TableData");
                        },
                        error: function (oError) {
                            var obj = JSON.parse(oError.responseText).error.message;
                            MessageBox.error(obj.value + '\n');
                        }
                    });

                }

            },
            handleReProcess: function (oEvent) {
                debugger;
                var that = this;
                // for(var i=0;i< this.arr_rowSel.length;i++){
                var batchChanges = [];
                var oUser = new sap.ushell.services.UserInfo(); 
                var userId = oUser.getId();
                that.getOwnerComponent().getModel().setUseBatch(true);

                //     this.arr_rowSel[0].MarkProcessed = "";
                // this.arr_rowSel[0].Fiori = "X";
                for (var i = 0; i < this.arr_rowSel.length; i++) {
                    this.arr_rowSel[i].MarkProcessed = "";
                    this.arr_rowSel[i].Fiori = "X";
                    this.arr_rowSel[i].Username = userId;
                }
                var json = new JSONModel();
                that.getView().setModel(json, "TableData");
                that.getOwnerComponent().getModel().setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo", success: function (odata, resp) {
                        console.log(resp);
                        json.setData({
                            tabledata_res: odata.results
                        });
                        that.getView().setModel(json, "TableData");
                        MessageBox.success("Records succesfully Processed");
                    }, error: function (oError) { console.log(oError);
                             var obj = JSON.parse(oError.responseText).error.message.value;
                        
                        MessageBox.error("Records not Processed succesfully, pls check suspense table");
                        Exit;
                    }
                };
                for (var m = 0; m < this.arr_rowSel.length; m++) {
                    that.getOwnerComponent().getModel().create("/ETS_MATERIAL_DOCUMENT_HEADER", this.arr_rowSel[m], mParameters);
                }
                that.getOwnerComponent().getModel().submitChanges(mParameters);
                // ______________
                // that.getOwnerComponent().getModel().create("/ETS_MATERIAL_DOCUMENT_HEADER", this.arr_rowSel[0], {
                //     method: "POST",
                //     success: function (res) {
                //         debugger;
                //         // that.getView().setBusy(false);
                //         // var oModel = new sap.ui.model.json.JSONModel(res);
                //         // that.getView().setModel(oModel, "TableData");
                //         json.setData({
                //             tabledata_res: res.results
                //         });
                //         that.getView().setModel(json, "TableData");
                //         MessageBox.success("Records succesfully Processed");
                //     },
                //     error: function (oError) {
                //         // oError.responseText
                //         var obj = JSON.parse(oError.responseText).error.message.value;
                //         // if(i = (this.arr_rowSel.length-1) ){
                //         // MessageBox.error(obj + '\n');
                //         MessageBox.error("Records not Processed succesfully, pls check suspense table");
                //         // }
                //     }
                // });
                // ____________



            },
            handleRowSelected: function (oEvent) {
                debugger;
                if(Core.byId("submissionNote")){
                    Core.byId("submissionNote").setValue("");
                }
                var selectedRowData = oEvent.getParameters().rowContext.getObject();
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-ddT00:00:00" });
                selectedRowData.CreatedOn = dateFormat.format(selectedRowData.CreatedOn);
                selectedRowData.PostingDate = dateFormat.format(selectedRowData.PostingDate);
                selectedRowData.ReceivedDateAtHub = dateFormat.format(selectedRowData.ReceivedDateAtHub);
                selectedRowData.DocumentDate = dateFormat.format(selectedRowData.DocumentDate);
                if (!this.arr_rowSel) {
                    this.arr_rowSel = [];
                }
                this.arr_rowSel.push(selectedRowData);
            },
            onSubmitDialogPress: function () {
                if (!this.oSubmitDialog) {
                    this.oSubmitDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Processing Comments",
                        content: [
                            new Label({
                                text: "Please Provide Comments",
                                labelFor: "submissionNote"
                            }),
                            new TextArea("submissionNote", {
                                id:"questionTextArea",
                                width: "100%",
                                value:"",
                                placeholder: "Add note (required)",
                                maxLength:100,
                                liveChange: function (oEvent) {
                                    var sText = oEvent.getParameter("value");
                                    this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                }.bind(this)
                            })
                        ],
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            enabled: false,
                            press: function () {
                                var sText = Core.byId("submissionNote").getValue();
                                // MessageToast.show("Note is: " + sText);
                                this.oSubmitDialog.close();
                                this.handleMarkProcessed(sText);
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                this.oSubmitDialog.close();
                            }.bind(this)
                        })
                    });
                }

                this.oSubmitDialog.open();
            },

            handleMarkProcessed: function (oEvent) {
                debugger;
                var that = this;
                var json = new JSONModel();
                // for(var i=0;i<this.arr_rowSel.length;i++){
                // this.arr_rowSel[0].MarkProcessed = "X";
                // this.arr_rowSel[0].Fiori = "X";
                // ____________
                var batchChanges = [];
                var oUser = new sap.ushell.services.UserInfo(); 
                var userId = oUser.getId();
                that.getOwnerComponent().getModel().setUseBatch(true);
                for (var i = 0; i < this.arr_rowSel.length; i++) {
                    this.arr_rowSel[i].MarkProcessed = "X";
                    this.arr_rowSel[i].Fiori = "X";
                    this.arr_rowSel[i].ProcessComment = oEvent;
                    this.arr_rowSel[i].Username = userId;
                }
                var json = new JSONModel();
                that.getView().setModel(json, "TableData");
                that.getOwnerComponent().getModel().setDeferredGroups(["foo"]);
                // var mParameters = {
                //     groupId: "foo", success: function (odata, resp) {
                //         console.log(resp);
                //         json.setData({
                //             tabledata_res: odata
                //         });
                //         that.getView().setModel(json, "TableData");
                //         MessageBox.success("Records succesfully Marked as Processed");
                //         that.MarkReprocess = true;
                //         that.arr_rowSel=[];
                //         that.onSearch();
                //         that.getView().byId("table1").clearSelection();
                //     }, 
                //     error: function (oError) { console.log(oError);
                //         var obj = JSON.parse(oError.responseText).error.message.value;
                //         // if(i = (this.arr_rowSel.length-1) ){
                //         // MessageBox.error(obj + '\n');
                //         that.arr_rowSel=[];
                //         MessageBox.error("Error Marking record as processed");
                //      }
                // };
                // for (var m = 0; m < this.arr_rowSel.length; m++) {
                //     that.getOwnerComponent().getModel().create("/ETS_MATERIAL_DOCUMENT_HEADER", this.arr_rowSel[m], mParameters);
                // }
                for (var m = 0; m < this.arr_rowSel.length; m++) {
                    that.getOwnerComponent().getModel().create("/ETS_MATERIAL_DOCUMENT_HEADER", this.arr_rowSel[m]);
                }
                that.getOwnerComponent().getModel().attachEventOnce("batchRequestCompleted", function (oEvent) {
					if (that._checkIfBatchRequestSucceeded(oEvent)) {
                        debugger;
						that._fnUpdateSuccess(oEvent);

						// that.getView().byId("zfin.gl.glview.display.analyticaltable").setSelectedIndex(6);
					} else {
                        debugger;
						// that._fnEntityCreationFailed();
						// MessageBox.error(that.getOwnerComponent().getModel("i18n").getResourceBundle().getText("UPDATE_ERROR"), {
						// 	actions: [MessageBox.Action.OK],
						// 	onClose: function (oAction) {}
						// });
                        MessageBox.error("Error Marking record as processed");
					}
				});
                that.getOwnerComponent().getModel().submitChanges();
                // that.getOwnerComponent().getModel().submitChanges(mParameters);
                // ___________
               
                // this.getOwnerComponent().getModel().create("/ETS_MATERIAL_DOCUMENT_HEADER", this.arr_rowSel[0], {
                //     method: "POST",
                //     success: function (res) {
                //         debugger;
                        
                //         json.setData({
                //             tabledata_res: res.results
                //         });
                //         that.getView().setModel(json, "TableData");
                //         MessageBox.success("Records succesfully Marked as Processed");
                //         that.MarkReprocess = true;
                //         that.onSearch();
                //         that.getView().byId("table1").clearSelection();

                //     },
                //     error: function (oError) {
                //         var obj = JSON.parse(oError.responseText).error.message.value;
                //         // if(i = (this.arr_rowSel.length-1) ){
                //         // MessageBox.error(obj + '\n');
                //         MessageBox.error("Error Marking reord as processed");
                //         // }
                //     }
                // });
                
            },
            _fnUpdateSuccess: function (oEvent) {
                var that = this;
                // this.getOwnerComponent().getModel().refresh(); // change done by rajasekhar
                // var changeGLView = "flagValue";
                // sap.ui.getCore().byId("zfin.gl.glview.display.smarttable");
                // sap.ui.controller("zfin.gl.glview.display.controller.Main").onRowSelectionChange(this, changeGLView); // change done by rajasekhar
                // this.getView().getModel("viewModel").setProperty("/busy", false);
                // var sPath = this.getView().byId("questionTextArea").getBindingContext().getPath() //+ "/WorkitemId";
                // var oRequest = this.getView().getModel("requestJournal").getProperty(sPath);
                // MessageBox.success(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("SUCCESS", [oRequest]), {
                //     actions: [MessageBox.Action.OK],
                //     onClose: function (oAction) {
                //         if (oAction === MessageBox.Action.OK) {
                //             that._navBack();
                //         }
                //     }
                // });
                        //   that.getView().setModel(json, "TableData");
                        MessageBox.success("Records succesfully Marked as Processed");
                        that.MarkReprocess = true;
                        that.arr_rowSel=[];
                        that.onSearch();
                        that.getView().byId("table1").clearSelection();
            },
            _fnEntityCreationFailed: function () {
                this.getView().getModel("viewModel").setProperty("/busy", false);
            },
            _checkIfBatchRequestSucceeded: function (oEvent) {
                var oParams = oEvent.getParameters();
                var aRequests = oEvent.getParameters().requests;
                var oRequest;
                if (oParams.success) {
                    if (aRequests) {
                        // if (aRequests[0].success === false) {
                        // 	aRequests = aRequests[0];
                        // }
                        for (var i = 0; i < aRequests.length; i++) {
                            oRequest = oEvent.getParameters().requests[i];
                            if (!oRequest.success) {
                                return false;
                            }
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            },
            onColumnVisibility: function () {

                if (!this._oResetPasswordDialog31) {
                    this._oResetPasswordDialog31 = sap.ui.xmlfragment(this.getView().getId(),
                        "com.pgr.suspence.project1pgr.controller.ColumnSelection", this);
                    this.getView().addDependent(this._oResetPasswordDialog31);
                }
                this._oResetPasswordDialog31.open();

                var openAssetTable = this.getView().byId("table1"),//table1
                    columnHeader = openAssetTable.getColumns();
                var openAssetColumns = [];
                var iCounter = 0;
                for (var i = 0; i < columnHeader.length; i++) {
                    //var hText = columnHeader[i].getAggregation("header").getProperty("text");
                    var hText = columnHeader[i].getAggregation("label").getProperty("text"); //UI Table change
                    var columnObject = {};
                    columnObject.column = hText;
                    columnObject.visiblity = columnHeader[i].getVisible();
                    openAssetColumns.push(columnObject);
                    if (columnHeader[i].getVisible()) {
                        iCounter++;
                    }

                }
                if (iCounter === columnHeader.length) {
                    this.getView().byId("checkboxAllSelected").setSelected(true);
                } else {
                    this.getView().byId("checkboxAllSelected").setSelected(false);
                }
                var oModel1 = new sap.ui.model.json.JSONModel({
                    list: openAssetColumns
                });
                /*	var itemTemplate = new sap.m.StandardListItem({
                        title: "{oList>column}"
                    });*/
                var oList = this.getView().byId("List");

                oList.setMode("MultiSelect");
                oList.setModel(oModel1, "oList");
                //	sap.ui.getCore().setModel(oModel1, "oList");
                /*	var oBindingInfo = {
                        path: 'oList>/list',
                        template: itemTemplate
                    };
                    oList.bindItems(oBindingInfo);*/
                oList.getModel("oList").refresh();
                var table = this.byId("table1").getColumns();

            },
            selectAllColumns: function (oEvent) {
                var oList = this.getView().byId("List");
                var items = oList.getItems();
                if (oEvent.getParameters().selected) {
                    oList.setMode("MultiSelect");
                    oList.selectAll();

                } else {
                    oList.removeSelections();
                    var oTable = this.getView().byId("table1").setVisible(true);
                }
            },
            onCancelColumnFrag: function (oEvent) {
                this._oResetPasswordDialog31.close();
            },
            onOKColumnFrag: function () {
                var oList = this.byId("List");
                var items = oList.getSelectedItems();
                var openAssetTable = this.getView().byId("table1"),
                    columnHeader = openAssetTable.getColumns();
                for (var j = 0; j < columnHeader.length; j++) {
                    columnHeader[j].setVisible(false);
                }
                var iCounter = 0;
                for (var i = 0; i < items.length; i++) {

                    for (var j = 0; j < columnHeader.length; j++) {
                        //var hText = columnHeader[j].getAggregation("header").getProperty("text");
                        var hText = columnHeader[j].getAggregation("label").getProperty("text"); //UI Table change

                        if (items[i].getTitle() === hText) {
                            columnHeader[j].setVisible(true);
                            iCounter++;
                        }

                    }

                }
                var finalCounter = iCounter * 50;
                //openAssetTable.setWidth(finalCounter + "px");
                this._oResetPasswordDialog31.close();

            },
        });
    });
