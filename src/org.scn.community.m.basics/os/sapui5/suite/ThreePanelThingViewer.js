/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.ThreePanelThingViewer");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.ux3.ThingViewer");sap.ui.ux3.ThingViewer.extend("sap.suite.ui.commons.ThreePanelThingViewer",{metadata:{publicMethods:["selectDefaultFacet"],library:"sap.suite.ui.commons",properties:{"logo":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"showHeader":{type:"boolean",group:"Misc",defaultValue:null},"sidebarWidth":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:'244px'}},aggregations:{"menuContent":{type:"sap.ui.commons.Link",multiple:true,singularName:"menuContent"}}}});jQuery.sap.require("sap.suite.ui.commons.VerticalNavigationBar");jQuery.sap.require("sap.ui.ux3.NavigationBar");jQuery.sap.require("sap.ui.ux3.ThingViewer");
sap.suite.ui.commons.ThreePanelThingViewer.prototype.init=function(){var t=this;this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");this._oNavBar=new sap.suite.ui.commons.VerticalNavigationBar();this.setAggregation("navBar",this._oNavBar);this._oNavBar.attachSelect(function(c){var i=c.getParameters().item;if(t.fireFacetSelected({id:i.getId(),key:i.getKey(),item:i})){t.setSelectedFacet(i);}else{c.preventDefault();}});this._iSelectedMenuItem=0;this._oMenuButton=new sap.ui.commons.Button({id:this.getId()+"-menu-button",tooltip:this._rb.getText("THREEPANELTHINGVIEWER_BUTTON_MENU_TOOLTIP"),lite:true,press:function(){t._toggleMenuPopup();}});this._oMenuButton.addStyleClass("sapSuiteTvTitleMb");this.fAnyEventHandlerProxy=jQuery.proxy(this.onAnyEvent,this);};
sap.suite.ui.commons.ThreePanelThingViewer.prototype.exit=function(){this._oMenuButton.destroy();jQuery.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);};
sap.suite.ui.commons.ThreePanelThingViewer.prototype.onAfterRendering=function(){this._bMenuOpened=false;this._updateMenuPopup();this._toggleHeaderContent();};
sap.suite.ui.commons.ThreePanelThingViewer.prototype.selectDefaultFacet=function(){this._selectDefault();return this;};
sap.suite.ui.commons.ThreePanelThingViewer.prototype._toggleMenuPopup=function(){jQuery.sap.byId(this.getId()+"-menu-popup").toggle();this._bMenuOpened=!this._bMenuOpened;if(this._bMenuOpened){jQuery.sap.bindAnyEvent(this.fAnyEventHandlerProxy);this.getMenuContent()[0].focus();this._iSelectedMenuItem=0;}else{jQuery.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);}};
sap.suite.ui.commons.ThreePanelThingViewer.prototype._updateMenuPopup=function(){var h=jQuery.sap.byId(this.getId()+"-header").width();var m=jQuery.sap.byId(this.getId()+"-menu-popup");var s=sap.ui.getCore().getConfiguration().getRTL()?"right":"left";var S=this.getMenuContent().length;m.css(s,(h-22)+"px");m.children().each(function(i){var $=jQuery(this);$.attr("tabindex","-1");$.attr("role","menuitem");$.attr("aria-posinset",i+1);$.attr("aria-setsize",S);});};
sap.suite.ui.commons.ThreePanelThingViewer.prototype._rerenderFacetContent=function(){var $=jQuery.sap.byId(this.getId()+"-facetContent");if($.length>0){var r=sap.ui.getCore().createRenderManager();sap.suite.ui.commons.ThreePanelThingViewerRenderer.renderFacetContent(r,this);r.flush($[0]);r.destroy();this._resize=false;this._setTriggerValue();this._onresize();}};
sap.suite.ui.commons.ThreePanelThingViewer.prototype._rerenderHeader=function(){var $=jQuery.sap.byId(this.getId()+"-header");if($.length>0){var r=sap.ui.getCore().createRenderManager();sap.suite.ui.commons.ThreePanelThingViewerRenderer.renderHeader(r,this);r.flush($[0]);r.destroy();}};
sap.suite.ui.commons.ThreePanelThingViewer.prototype._rerenderHeaderContent=function(){var $=jQuery.sap.byId(this.getId()+"-headerContent");if($.length>0){var r=sap.ui.getCore().createRenderManager();sap.suite.ui.commons.ThreePanelThingViewerRenderer.renderHeaderContent(r,this);r.flush($[0]);r.destroy();}};
sap.suite.ui.commons.ThreePanelThingViewer.prototype._toggleHeaderContent=function(){var c=jQuery.sap.byId(this.getId()+"-headerContent");if(this.getShowHeader()){c.show();}else{c.hide();}};
sap.suite.ui.commons.ThreePanelThingViewer.prototype.onAnyEvent=function(e){if(this._bMenuOpened&&(e.type=="mousedown"||e.type=="focusin")){var s=e.target;var d=jQuery.sap.domById(this.getId()+"-menu-popup");if(!jQuery.sap.containsOrEquals(d,s)||s.tagName=="BODY"){this._toggleMenuPopup();}}};
sap.suite.ui.commons.ThreePanelThingViewer.prototype.onsapescape=function(){if(this._bMenuOpened){this._toggleMenuPopup();this._oMenuButton.focus();}};
sap.suite.ui.commons.ThreePanelThingViewer.prototype.onsapnext=function(e){if(this._bMenuOpened){var m=this.getMenuContent();this._iSelectedMenuItem++;if(this._iSelectedMenuItem>=m.length){this._iSelectedMenuItem=0;}m[this._iSelectedMenuItem].focus();e.preventDefault();e.stopPropagation();}};
sap.suite.ui.commons.ThreePanelThingViewer.prototype.onsapprevious=function(e){if(this._bMenuOpened){var m=this.getMenuContent();this._iSelectedMenuItem--;if(this._iSelectedMenuItem<0){this._iSelectedMenuItem=m.length-1;}m[this._iSelectedMenuItem].focus();e.preventDefault();e.stopPropagation();}};
sap.suite.ui.commons.ThreePanelThingViewer.prototype.setShowHeader=function(s){this.setProperty("showHeader",s,true);this._toggleHeaderContent();return this;};
