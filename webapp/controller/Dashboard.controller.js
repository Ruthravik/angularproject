sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, MessageToast, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("com.ehsm.portal.controller.Dashboard", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("dashboard").attachPatternMatched(this._onObjectMatched, this);
            
            // Initialize dashboard models
            this._initializeDashboardModels();
        },

        _onObjectMatched: function () {
            // Check if user is authenticated
            this._checkUserAuthentication();
            
            // Load dashboard data when route is matched
            this._loadDashboardData();
        },

        _checkUserAuthentication: function () {
            var oUserModel = this.getOwnerComponent().getModel("userModel");
            
            if (!oUserModel || !oUserModel.getProperty("/IsLoggedIn")) {
                // User not authenticated, navigate back to login
                MessageToast.show("Please login to access dashboard");
                this.onNavBack();
                return false;
            }
            return true;
        },

        _initializeDashboardModels: function () {
            // Initialize dashboard summary model
            var oDashboardModel = new JSONModel({
                riskCount: 0,
                incidentCount: 0,
                lastUpdated: new Date(),
                riskTrend: "up",
                incidentTrend: "down",
                riskStatus: "Error",
                incidentStatus: "Critical"
            });
            this.getView().setModel(oDashboardModel, "dashboardModel");

            // Initialize risk model
            var oRiskModel = new JSONModel({
                risks: []
            });
            this.getView().setModel(oRiskModel, "riskModel");

            // Initialize incident model
            var oIncidentModel = new JSONModel({
                incidents: []
            });
            this.getView().setModel(oIncidentModel, "incidentModel");
        },

        _loadDashboardData: function () {
            var oView = this.getView();
            var oUserModel = this.getOwnerComponent().getModel("userModel");
            var sUserId = oUserModel ? oUserModel.getProperty("/UserId") : "";

            if (!sUserId) {
                MessageToast.show("User ID not found. Please login again.");
                this.onNavBack();
                return;
            }

            // Show busy indicator
            oView.setBusy(true);

            // Load both Risk and Incident data counts only
            this._loadRiskCount(sUserId);
            this._loadIncidentCount(sUserId);
        },

        _loadRiskCount: function (sUserId) {
            var oModel = this.getOwnerComponent().getModel();
            var oRiskModel = this.getView().getModel("riskModel");
            var oDashboardModel = this.getView().getModel("dashboardModel");

            oModel.read("/ZEHSM_RISKSet", {
                urlParameters: {
                    "$filter": "Userid eq '" + encodeURIComponent(sUserId) + "'",
                    "$inlinecount": "allpages"
                },
                success: function (oData) {
                    console.log("Risk count loaded:", oData.results.length);
                    
                    // Store risks data for later use and update count
                    var aRisks = oData.results || [];
                    oRiskModel.setProperty("/risks", aRisks);
                    oDashboardModel.setProperty("/riskCount", aRisks.length);
                    oDashboardModel.setProperty("/lastUpdated", new Date());
                    
                    this._checkLoadingComplete();
                }.bind(this),
                error: function (oError) {
                    console.error("Error loading risk data:", oError);
                    MessageToast.show("Error loading risk data");
                    this._checkLoadingComplete();
                }.bind(this)
            });
        },

        _loadIncidentCount: function (sUserId) {
            var oModel = this.getOwnerComponent().getModel();
            var oIncidentModel = this.getView().getModel("incidentModel");
            var oDashboardModel = this.getView().getModel("dashboardModel");

            oModel.read("/ZINCIDIENT_TABLESet", {
                urlParameters: {
                    "$filter": "Userid eq '" + encodeURIComponent(sUserId) + "'",
                    "$inlinecount": "allpages"
                },
                success: function (oData) {
                    console.log("Incident count loaded:", oData.results.length);
                    
                    // Store incidents data for later use and update count
                    var aIncidents = oData.results || [];
                    oIncidentModel.setProperty("/incidents", aIncidents);
                    oDashboardModel.setProperty("/incidentCount", aIncidents.length);
                    oDashboardModel.setProperty("/lastUpdated", new Date());
                    
                    this._checkLoadingComplete();
                }.bind(this),
                error: function (oError) {
                    console.error("Error loading incident data:", oError);
                    MessageToast.show("Error loading incident data");
                    this._checkLoadingComplete();
                }.bind(this)
            });
        },

        _checkLoadingComplete: function () {
            // Hide busy indicator when both calls are complete
            var oView = this.getView();
            setTimeout(function() {
                oView.setBusy(false);
            }, 500);
        },

        // Navigation Functions
        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteLogin");
        },

        onLogout: function () {
            MessageBox.confirm("Are you sure you want to logout?", {
                title: "Confirm Logout",
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        this._performLogout();
                    }
                }.bind(this)
            });
        },

        _performLogout: function () {
            // Clear user session
            var oUserModel = this.getOwnerComponent().getModel("userModel");
            if (oUserModel) {
                oUserModel.setProperty("/IsLoggedIn", false);
                oUserModel.setProperty("/UserId", "");
            }

            // Navigate to login page
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteLogin");
            
            MessageToast.show("Logged out successfully");
        },

        // Tile Press Events - Navigate to separate pages
        onRiskTilePress: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            var oRiskModel = this.getView().getModel("riskModel");
            var aRisks = oRiskModel.getProperty("/risks");
            
            // Set risks data to component model for sharing across views
            var oRiskDataModel = new JSONModel({
                risks: aRisks,
                count: aRisks.length
            });
            this.getOwnerComponent().setModel(oRiskDataModel, "riskDataModel");
            
            // Navigate to Risk Management page
            oRouter.navTo("riskManagement");
        },

        onIncidentTilePress: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            var oIncidentModel = this.getView().getModel("incidentModel");
            var aIncidents = oIncidentModel.getProperty("/incidents");
            
            // Set incidents data to component model for sharing across views
            var oIncidentDataModel = new JSONModel({
                incidents: aIncidents,
                count: aIncidents.length
            });
            this.getOwnerComponent().setModel(oIncidentDataModel, "incidentDataModel");
            
            // Navigate to Incident Management page
            oRouter.navTo("incidentManagement");
        },

        // Refresh functionality
        onRefreshData: function () {
            MessageToast.show("Refreshing dashboard data...");
            this._loadDashboardData();
        },

        // User Menu Events
        onUserMenuPress: function () {
            var oUserModel = this.getOwnerComponent().getModel("userModel");
            var sUserId = oUserModel.getProperty("/UserId");
            var sLoginTime = oUserModel.getProperty("/LoginTime");
            
            MessageBox.information("User Information:\n\n" + 
                                 "Employee ID: " + sUserId + "\n" +
                                 "Role: Safety Engineer\n" +
                                 "Login Time: " + sLoginTime + "\n" +
                                 "Portal Version: 1.1", {
                title: "User Profile"
            });
        }
    });
});