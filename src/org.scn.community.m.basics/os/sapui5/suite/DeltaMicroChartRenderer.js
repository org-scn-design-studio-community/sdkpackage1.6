/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.DeltaMicroChartRenderer");sap.suite.ui.commons.DeltaMicroChartRenderer={};
sap.suite.ui.commons.DeltaMicroChartRenderer.render=function(r,c){var d=c.getDisplayValue1();var D=c.getDisplayValue2();var v=c.getValue1();var V=c.getValue2();var s=c.getDeltaDisplayValue();var a=d?d:""+v;var A=D?D:""+V;var b=s?s:""+Math.abs(v-V).toFixed(Math.max(c._digitsAfterDecimalPoint(v),c._digitsAfterDecimalPoint(V)));var C=c.getColor();var t=c.getTooltip_AsString();if(typeof t!=="string"){t="";}var S=c.getSize();var n=(!c.getTitle1()&&!c.getTitle2());function g(l){return l?"Left":"Right";};r.write("<div");r.writeControlData(c);r.addClass("sapSuiteDmc");if(c.hasListeners("press")){r.addClass("sapSuiteUiCommonsPointer");r.writeAttribute("tabindex","0");}r.addClass(S);r.writeAttribute("role","presentation");r.writeAttributeEscaped("aria-label",c.getAltText().replace(/\s/g," ")+(sap.ui.Device.browser.firefox?"":" "+t));r.writeAttributeEscaped("title",t);r.writeClasses();if(c.getWidth()){r.addStyle("width",c.getWidth());r.writeStyles();}r.write(">");r.write("<div");r.addClass("sapSuiteDmcCnt");r.addClass(S);r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",c.getId()+"-title1");r.addClass("sapSuiteDmcTitle");r.addClass("Top");r.writeClasses();r.write(">");r.writeEscaped(c.getTitle1());r.write("</div>");r.write("<div");r.addClass("sapSuiteDmcChart");r.addClass(S);if(n){r.addClass("NoTitles");}r.writeClasses();r.writeAttribute("id",c.getId()+"-dmc-chart");r.write(">");r.write("<div");r.addClass("sapSuiteDmcBar");r.addClass("Bar1");r.addClass(S);if(c._oChartData.delta.isMax){r.addClass("MaxDelta");}if(c._oChartData.bar1.isSmaller){r.addClass("Smaller");}r.addClass(g(c._oChartData.bar1.left));r.writeClasses();r.addStyle("width",c._oChartData.bar1.width+"%");r.writeStyles();r.writeAttribute("id",c.getId()+"-dmc-bar1");r.write(">");r.write("<div");r.addClass("sapSuiteDmcBarInternal");r.addClass(g(c._oChartData.bar2.left));r.writeClasses();r.write(">");r.write("</div>");r.write("</div>");r.write("<div");r.addClass("sapSuiteDmcBar");r.addClass("Bar2");r.addClass(S);if(c._oChartData.delta.isMax){r.addClass("MaxDelta");}if(c._oChartData.bar2.isSmaller){r.addClass("Smaller");}r.addClass(g(c._oChartData.bar2.left));r.writeClasses();r.addStyle("width",c._oChartData.bar2.width+"%");r.writeStyles();r.writeAttribute("id",c.getId()+"-dmc-bar2");r.write(">");r.write("<div");r.addClass("sapSuiteDmcBarInternal");r.addClass(g(c._oChartData.bar1.left));r.writeClasses();r.write(">");r.write("</div>");r.write("</div>");r.write("<div");r.addClass("sapSuiteDmcBar");r.addClass("Delta");r.addClass(S);if(!c._oChartData.delta.isMax){r.addClass("NotMax");}if(c._oChartData.delta.isZero){r.addClass("Zero");}if(c._oChartData.delta.isEqual){r.addClass("Equal");}r.addClass(g(c._oChartData.delta.left));r.writeClasses();r.addStyle("width",c._oChartData.delta.width+"%");r.writeStyles();r.writeAttribute("id",c.getId()+"-dmc-bar-delta");r.write(">");r.write("<div");r.addClass(C);r.addClass("sapSuiteDmcBarDeltaInt");r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("sapSuiteDmcBarDeltaStripe");r.addClass(g(true));if(c._oChartData.delta.isEqual){r.addClass("Equal");}r.addClass(c._oChartData.delta.isFirstStripeUp?"Up":"Down");r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("sapSuiteDmcBarDeltaStripe");r.addClass(g(false));r.addClass(c._oChartData.delta.isFirstStripeUp?"Down":"Up");r.writeClasses();r.write(">");r.write("</div>");r.write("</div>");r.write("</div>");r.write("<div");r.writeAttribute("id",c.getId()+"-title2");r.addClass("sapSuiteDmcTitle");r.addClass("Btm");r.writeClasses();r.write(">");r.writeEscaped(c.getTitle2());r.write("</div>");r.write("</div>");r.write("<div");r.addClass("sapSuiteDmcLbls");r.addClass(S);r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",c.getId()+"-value1");r.addClass("sapSuiteDmcValue1");r.writeClasses();r.write(">");r.writeEscaped(a);r.write("</div>");r.write("<div");r.writeAttribute("id",c.getId()+"-delta");r.addClass("sapSuiteDmcDelta");r.addClass(C);r.writeClasses();r.write(">");r.writeEscaped(b);r.write("</div>");r.write("<div");r.writeAttribute("id",c.getId()+"-value2");r.addClass("sapSuiteDmcValue2");r.writeClasses();r.write(">");r.writeEscaped(A);r.write("</div>");r.write("</div>");r.write("<div");r.writeAttribute("id",c.getId()+"-calc");r.addClass("sapSuiteDmcCalc");r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",c.getId()+"-calc1");r.addClass("sapSuiteDmcCalc1");r.writeClasses();r.write("></div>");r.write("<div");r.writeAttribute("id",c.getId()+"-calc2");r.addClass("sapSuiteDmcCalc2");r.writeClasses();r.write("></div>");r.write("</div>");r.write("</div>");};
