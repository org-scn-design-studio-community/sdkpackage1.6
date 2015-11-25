/**
 * Copyright 2015 SCN Community Contributors
 * 
 * Original Source Code Location:
 *  https://github.com/sap-design-studio-free-addons/sdk-package
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at 
 *  
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and 
 * limitations under the License. 
 * 
 */
/**
 *	Officially working sap.m mode sap.m.SegmentedButton for Design Studio 1.6
 */
define(["css!../ZenCrosstabFix.css"], function() {
	var componentInfo = {
		visible : true,
		title : "Fiori Button",
		icon : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHySURBVDhPlY9NaxNRFIbPbdKFK1HwB7hxowvBVUXwB4h7xY3dK/oDBCmYNoGYtqixYHWTCIKL0oJ1YW2aBPrhTBPbkRYsVWkTC8GEaqfJzP2q771jpS1ufGfuuXfe85xz7tDef+pogdYaMVltec3w7+dB/WPCdiCP5zb6Fls4q6P84QJp8xPf/LOvN69PbUkV2YdEBokWHtvv2rs6vajFn666jTauZJvYhGXMBHDmrjaGUp/Jf2bZFXq2PuI14WCsbYWjiRRxkEJC7339FRx7stQ1XGWjX+4Wa0iaggOiP7vWAhVKO1t+bMjFy7KrNybXtZJQBESFhM5G2KSJSw0/lp6LZebpkXfz7Zo2tEmCtldQFPFQh0suRLbynQ0tdqdnWcY597zyww/9ALP3FRVwTFVq2Nm8+NI7nZ2PPZyLp0pdySJLlS7nq5dy1Z9oZnmpJGEBD7g4P7pAgw71lygxwxLvKTFN/WVKlVnmQ265DijkApFMkLLlByfThe5U+WrOvZJ32YPCiYGpO29WTiWn44Pu/cIasI4pECSMJN4Lj0vxvmJ9e7fhd3pGZm+PL4tWo/dVhQYWxrw6kCDk4EhwEYYcGvdq9yY/CY4/582d9k4ngOlsNG+NfYQFRdFMAGMqgoC3d+0xNJ51TVuY1jUk578Bvm+Y4nNJ66IAAAAASUVORK5CYII=",
		author : "Mike Howles",
		description : "A Fiori-Inspired Tiles using UI5 Handler",
		topics : [{
			title : "SDK Component",
			content : "This component is an UI5 SDK Component.  Be sure you install the plugin to your server platform should you find it useful."
		},{
			title : "SCN SDK Components License",
			content : "SCN SDK Components License is released under the Apache 2.0 License. Please refer to the licenses for the full copyright restrictions placed on this software.  (<a target='_blank' href='http://www.apache.org/licenses/LICENSE-2.0'>Apache 2.0 License</a>)"
		}]
	};
	var dsProperties = {
		onpress : { 
			ui5Meta : "string",
			opts : {
				cat : "General",
				order : 0,
				desc : "On Press",
				apsControl : "script"
			}
		},
		buttonType : {
			opts : {
				cat : "General",
				desc : "Button Type",
				apsControl : "combobox",
				options : [
				   {key : "Default", text : "Default"},
				   {key : "Accept", text : "Accept"},
				   {key : "Back", text : "Back"},
				   {key : "Emphasized", text : "Emphasized"},
				   {key : "Reject", text : "Reject"},
				   {key : "Transparent", text : "Transparent"},
				   {key : "Unstyled", text : "Unstyled"},
				   {key : "Up", text : "Up"}
				]
			},
			ui5Meta : "string",
		},
		enabled : {
			opts : {
				cat : "General",
				desc : "Enabled",
				defaultValue : true,
				apsControl : "checkbox",
			},
			ui5Meta : "boolean"
		},
		text : {
			opts : {
				cat : "General",
				desc : "Text",
				apsControl : "text",
			},
			ui5Meta : "string"
		},
		icon : {
			opts : {
				cat : "General",
				desc : "Icon",
				apsControl : "text",
			},
			ui5Meta : "string"
		},
		activeIcon : {
			opts : {
				cat : "General",
				desc : "Active Icon",
				apsControl : "text",
			},
			ui5Meta : "string"
		}
	};
	// jQuery.sap.declare("sap.suite.ui.commons.sample.GenericTile1x1.Component");
	sap.ui.controller("sap.suite.ui.commons.sample.GenericTile1x1.GenericTile1x1", {
        press : function (evt) {
                sap.m.MessageToast.show("The generic tile is pressed.");
        }
	});
	
	var meta = {
		properties : {},
		//rootView : "GenericTile1x1",
        dependencies : {
                libs : [
                        "sap.suite.ui.commons"
                ]
        }
	};
	for(var p in dsProperties){
		if(dsProperties[p].ui5Meta) meta.properties[p] = dsProperties[p].ui5Meta;
	}
	
	sap.ui.core.ComponentContainer.extend("org.scn.community.m.basics.Tiles", {
	    metadata : meta,
	    renderer : {},
		metadata : meta,
		pressHandler : function(oControlEvent){
			this.fireDesignStudioEvent("onpress");
		},
		setButtonType : function(b){
			this.setType(b);
			//sap.m.Switch.prototype.setShowNavButton.apply(this,arguments);
			//if(this._navBtn) this._navBtn.attachPress(this.dsClick,this);
		},
		initDesignStudio : function() {
			// Called by sap.designstudio.sdkui5.Handler  (sdkui5_handler.js)
			//this.addStyleClass("DesignStudioSCN");
			//this.addStyleClass("Button");
			// this.attachPress(this.pressHandler,this);
		},
		/**
		 * Relays Design Studio Property Information over to Additional Properties Sheet.
		 */
		getPropertyMetaData : function(){
			var r = [];
			for(var prop in dsProperties){
				var o = {
					name : prop,
					opts : dsProperties[prop].opts || {}
				}
				if(!o.opts.noAps) r.push(o);				
			}
			return JSON.stringify(r);
		},
		/**
		 * Component Information
		 */
		getComponentInformation : function(){
			return JSON.stringify(componentInfo);
		}
	});
});