var propertyPageHandlerRegistry = propertyPageHandlerRegistry || [];
sap.designstudio.sdk.PropertyPage.subclass("org.scn.community.generic.PropertyPage", function() {
	var that = this;
	this.rendered = false;
	/**
	 * Crawl Node config by node key to find its UI sheet.
	 */
	this.findUI = function(node,nodename){
		if(node.key==nodename) return node.ui;
		for(var childNode in node.nodes){
			var child = this.findUI(node.nodes[childNode],nodename);
			if(child) {
				//alert("found " + nodename + child);
				return child;
			}
		}
		return null;
	}
	/**
	 * Render either a Nav Sheet or a Property Sheet, depending on the node config passed.
	 */
	this.render = function(node,ui){
		var sheet = false;
		var leafcount = 0;
		for(var leaf in node.leafs) leafcount++;
		node.ui = ui;
		if(leafcount>0) {	// Render a Sheet.
			for(var leaf in node.leafs){
				var property = node.leafs[leaf].name;
				var propertyOptions = node.leafs[leaf].opts;
				var apsControl = propertyOptions.apsControl;
				if(!apsControl) apsControl = "text";
				this.props[property] = {
						value : null
					};
					// Step 1, create getter/setter
					this[property] = function(property,apsControl,onSet){
						return function(value){
							if(value===undefined){
								return this.props[property].value;
							}else{
								if(onSet) {
									if(that.componentInstance != undefined) {
										value = that.componentInstance.callOnSet (property,value.replace(/(\n|\r\n)/g,"__n__"));
									} else {
										value = this.callRuntimeHandler("callOnSet",property,value.replace(/(\n|\r\n)/g,"__n__"));
									}
								}
								this.props[property].value = value;
								/**
								 * Scan handler registry
								 */
								for(var i=0;i<propertyPageHandlerRegistry.length;i++){
									var handler = propertyPageHandlerRegistry[i];
									if(handler.id == apsControl) {
										handler.setter.call(this, property, value);
									}
								}
								return this;
							}
						};
					}(property,apsControl,propertyOptions.onSet);
					// Step 2, create component event handler
					var f = function(property,apsControl){
						return function(oControlEvent){
							var newValue;
							/**
							 * Scan handler registry
							 */
							for(var i=0;i<propertyPageHandlerRegistry.length;i++){
								var handler = propertyPageHandlerRegistry[i];
								if(handler.id == apsControl) {
									newValue = handler.getter.call(this, property, oControlEvent.getSource());
								}
							}
							this.props[property].value = newValue;
							if(!this.isTest) {
								this.firePropertiesChanged([property]);	
							} else {
								alert("Property: " + property + "\r\nValue:\r\n" + newValue);
							}
							
						};
					}(property,apsControl);
					/**
					 * Scan handler registry
					 */
					for(var i=0;i<propertyPageHandlerRegistry.length;i++){
						var handler = propertyPageHandlerRegistry[i];
						if(handler.id == apsControl) {
							this["cmp_"+property] = handler.createComponent.call(this, property, propertyOptions, f);
						}
					}
					// assure there is a control! Make text Area
					if(this["cmp_"+property] == undefined){
						this["cmp_"+property] = new sap.ui.commons.TextArea({
							design : sap.ui.core.Design.Monospace,
							rows : 20,
							width : "100%",
							wrapping : sap.ui.core.Wrapping.Off
						});
						this["cmp_"+property].attachChange(f,this);
					}
					
					// Step 3a, if component has afterInit method, call it!
					
					if(this["cmp_"+property].afterInit) {
						this["cmp_"+property].afterInit();	
					}
					
					// Step 4, add control to layout
					//etcLayout.addContent(this.hLabel(property,this["cmp_"+property]));
					var useLabel = true;
					if(this["cmp_"+property].needsLabel) {
						useLabel = this["cmp_"+property].needsLabel();	
					}
					
					if(useLabel){
						// set width to 320px
						if(this["cmp_"+property].setWidth) {
							// Certain APS Controls don't need to have width set like checkbox (cause horizontal scroll issues)
							if(apsControl != "checkbox"
								&& apsControl != "combobox"
								&& apsControl !="script"
								&& apsControl !="dataselection"
								&& apsControl !="excelgrid"){
								this["cmp_"+property].setWidth("320px");
							}
						}
						node.ui.addContent(this.hLabel(propertyOptions.desc || property,this["cmp_"+property]));
					}else{
						node.ui.addContent(this["cmp_"+property]);
					}
			}
		}else{	// Render nav strip and child ui area.
			var strip;
			var stageUI;
			if(node==this.tree){
				strip = this.mainLayout;
				stageUI = this.mainLayout;
			}else{
				strip = new sap.ui.ux3.NavigationBar({
					toplevelVariant : (node==this.tree),
					width : "100%"
				});
				stageUI = new sap.ui.commons.layout.VerticalLayout({
					width : "100%"
				});
			}
			node.strip = strip;
			node.stageUI = stageUI;
			var firstChild = null;
			var firstChildUI = null;
			for(var childNode in node.nodes){
				var stripItem = new sap.ui.ux3.NavigationItem({
					key:node.nodes[childNode].key,
					text:node.nodes[childNode].title,
				});
				if(!firstChild) firstChild = stripItem;
				if(strip!=this.mainLayout){
					strip.addItem(stripItem);
				}else{
					strip.addWorksetItem(stripItem);
				}
				var childUI = new sap.ui.commons.layout.VerticalLayout({
					width : "100%"
				});
				childUI.addStyleClass("org-scn-ApsPropChild");
				this.render(node.nodes[childNode],childUI);
				if(!firstChildUI) firstChildUI = childUI;
			};
			//strip.setSelectedItem(firstChild);
			if(strip!=this.mainLayout){
				strip.attachSelect(function(oControlEvent){
					var selectedKey = oControlEvent.getParameters().item.getKey();
					stageUI.removeAllContent();
					if(selectedKey=="ABOUT"){
						stageUI.addContent(this.aboutLayout);
					}else{
						stageUI.addContent(this.findUI(this.tree,selectedKey));	
					}				
				},this);
				ui.addContent(strip);
			}else{
				strip.attachWorksetItemSelected(function(oControlEvent){
					var selectedKey = oControlEvent.getParameters().item.getKey();
					stageUI.removeAllContent();
					if(selectedKey=="ABOUT"){
						stageUI.addContent(this.aboutLayout);
					}else{
						stageUI.addContent(this.findUI(this.tree,selectedKey));	
					}				
				},this);
			}
			
			
			ui.addContent(stageUI);
			stageUI.addContent(firstChildUI);
		}
		this.rendered = true;
	};
	/**
	 * Balances out hierarchy to not allow for cases where a node has nodes AND leafs.
	 * This is because we are either rendering a Navigation Strip OR a property sheet section.
	 * It would be ugly to try to render properties followed by a child Nav Strip.
	 */
	this.balance = function(node){
		var leafcount = 0;
		var nodecount = 0;
		for(var leaf in node.leafs) leafcount++;
		for(var leaf in node.nodes) nodecount++;
		if(nodecount>0 && leafcount>0) {
			// Move leafs to new node.
			node.nodes.splice(0,0,{
				key : node.title + "-General",
				title : node.title,
				nodes : [],
				leafs : node.leafs
			});
			// Remove leafs from original node.
			node.leafs = [];
		}
		if(nodecount>0){
			for(var child in node.nodes){
				this.balance(node.nodes[child]);
			}
		}
	};
	/**
	 * Design Studio Events
	 */
	this.init = function(){
		try {
		
		if(global != undefined && global.component != undefined) {
			this.componentInstance = global.component;
		}

		var componentInfo = {};
		if(this.componentInstance != undefined) {
			componentInfo = this.componentInstance.getComponentInformation();
		} else {
			if(!this.isTest){
				componentInfo = this.callRuntimeHandler("getComponentInformation");	
			} else {
				var testComponent = this.getUrlParameterByName("component");
				var testComponent = testComponent.substring(0, testComponent.indexOf(","));
				var componentObject = eval(testComponent);
				
				this.componentInstance = componentObject.instance();
				componentInfo = this.componentInstance.getComponentInformation();
			}
		}

		if(componentInfo && componentInfo != "") {
			try{
			componentInfo = jQuery.parseJSON(componentInfo);
			}catch(e){
				alert("Bad Component Info found.")
			}
		}

		// alert("Component Info." + componentInfo);
		/**
		 * Attach additional handlers, depending on component capabilities
		 */
		if(componentInfo && componentInfo.supportsFlatData){
			var that = this;
			this.dataPropertyListeners = [];
			if(!this.DATA_SOURCE_ALIAS_REF) this.DATA_SOURCE_ALIAS_REF = function(v){
				if(v===undefined){
					return this._dsr;
				}else{
					this._dsr = v;
					if(this.dsPoll) window.clearTimeout(this.dsPoll);
					this.dsPoll = window.setTimeout(function(){that.updateDataInfo("DATA_SOURCE_ALIAS_REF changed");}, 1500);
					return this;
				}
			}
			this.componentSelected = function(){
				if(this.dsPoll) window.clearTimeout(this.dsPoll);
				this.updateDataInfo("Component Selected");
				//alert(JSON.stringify(ds_getDataJSON()));
				//alert(ds_getMetadataPropertiesAsJSON());
			}

			this.registerDataComponent = function(cmp){
				this.dataPropertyListeners.push(cmp);
			};

			/**
			 * Get Data Source Metadata
			 */
			this.updateDataInfo = function(reason){
				jQuery.sap.log.info("Updating Data Source Info because: " + reason);
				var that = this;
				// Get Property Metadata from Design Studio Component Runtime.
				try{
					var dsm = this.callRuntimeHandler("getAPSMetaData");
					var fd = this.callRuntimeHandler("getAPSFlatData");
					// If both values are the same, don't bother updating APS components
					if(dsm == this.oldDSM && fd == this.oldFD) return;
					this.oldDSM = dsm;
					this.oldFD = fd;
					var fdMeta = {
						msg : "Not loaded",
						data : null
					}
					delete this.dsMetadata;
					delete this.flatData;
					if(dsm && dsm != "") {
						this.dsMetadata = jQuery.parseJSON(dsm);
					}
					if(fd && fd != "") {
						fdMeta = jQuery.parseJSON(fd);
						if(fdMeta && fdMeta.data) this.flatData = fdMeta.data;
					}
					// Update data-sensitive components to metadata or flatdata changes.
					for(var i=0;i<this.dataPropertyListeners.length;i++){
						var cmp = this.dataPropertyListeners[i];
						if(cmp !=undefined && cmp.notifyDataChange) cmp.notifyDataChange();
					}
				}catch(e){
					alert("An error occured with APS communicating with the Design Studio runtime.  Please try reloading your dashboard.\n\n"+e);
				}
			};
		}

		/*this.appHeader = new sap.ui.commons.ApplicationHeader({
			displayLogoff : false,
			logoText : "Property Sheet",
			displayWelcome : false,
			logoSrc : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMwSURBVHjaYtxYISDCwMDQBMSZDBAwHYjr/NrfvwFxkgrqMOTnTWjKgrIZAAKIYUUR34zLW2r+//3+DoxBbJDY////GUA4Lqdqxtqte/7DQHxu9X+YHAgDBBDTj1//0tUswhm29LkwLC6VYwCxQWJwG/7/Tw/wcGT48/cvQ3xOFcOXj+/XMAIBTBoggJi+/vjL8PPVBYYn968zcAopg9kgMUYo+PvvL8Off/8ZPnz6wvDnz+93l88db43OLJsak1X+H4inAQQQy4NXfzee3LfIP7FuLcP/P98Yjm2byQASA5kemVY8VUtNmeH/PwYGPm4ehgAvFyGgs7f8+/tXeumMHobojJJMgABi1JdnMrfTZKoU5mX0B2l6+/n/xkPX/7Wru+TFK8nLZrbVFDH8+P2H4e69BwzqqkoMnz59ZhAS4AeLJWSVMgAEEMgvrECsCMRSUG89C4jNKlJVVkhvry1m2Ln3EIOcrAxYQklBDuQ1cOCt3byTYfmqdWsAAogxIDYTPZoY9HU0GWpLssGaQQBkwN5DxxgOHDkBD9tvXz+vuX31QitAALH8/v2nJSLQJz0qxJcBGezYexCuecaC5Qw3rt9Ys3fTsg4kJa9BrgUIIJZ///6m+/u4M7z68IXh0+cvDHy8PAxvXr2EO3va3CUM129cX3Ngy6piIPcxSCwxv/YfiFaREysBCCCWv8D4/fztJ0NiRh7Ib+/8fTyFAn29GN69ecWwbM1GhitXr6yRlVP8AdT0ENmFM7prGfJLqnsAAojp6+ePa+JSsxhA9IXj+4PWbdj06u279wwCQqIMp86eZzi8fS3QZsaY0rx0BhsLUwYQDQJ3H79i+PSTgQEggFiO7toAchrIb68dfMKrgK4QExIQYPj77x8DML4ZYM6+euUKw+dPH8E0MgAIIBaghkfAqHkMSuD2PuHp+zYuY3j88iPDuo2bGb5+/bIGpOjB3Ztrp895EgzTJK+kAjaIh/0fA0AAMYLiFARAydbUwWsVOydXCIj/8/u3NU/u3Wx99vDOBaCUHFBIFGaAk2/kGRCtLCs2CSCA4AZADUFWCI4moPwfBjQAVGcMZT4BCDAAVE+Dr1XMs78AAAAASUVORK5CYII="
		});
		*/
		/**
		 * Main Layout is coupled with top level node config (this.tree)
		 */
		/*this.mainLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "98%"
		});*/
		this.mainLayout = new sap.ui.ux3.Shell({
			fullHeightContent : true,
			headerType : sap.ui.ux3.ShellHeaderType.Standard,
			designType : sap.ui.ux3.ShellDesignType.Crystal,
			showLogoutButton : false,
			showTools : false,
			showPane : false,
			logoText : "Property Sheet",
			appIcon : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMwSURBVHjaYtxYISDCwMDQBMSZDBAwHYjr/NrfvwFxkgrqMOTnTWjKgrIZAAKIYUUR34zLW2r+//3+DoxBbJDY////GUA4Lqdqxtqte/7DQHxu9X+YHAgDBBDTj1//0tUswhm29LkwLC6VYwCxQWJwG/7/Tw/wcGT48/cvQ3xOFcOXj+/XMAIBTBoggJi+/vjL8PPVBYYn968zcAopg9kgMUYo+PvvL8Off/8ZPnz6wvDnz+93l88db43OLJsak1X+H4inAQQQy4NXfzee3LfIP7FuLcP/P98Yjm2byQASA5kemVY8VUtNmeH/PwYGPm4ehgAvFyGgs7f8+/tXeumMHobojJJMgABi1JdnMrfTZKoU5mX0B2l6+/n/xkPX/7Wru+TFK8nLZrbVFDH8+P2H4e69BwzqqkoMnz59ZhAS4AeLJWSVMgAEEMgvrECsCMRSUG89C4jNKlJVVkhvry1m2Ln3EIOcrAxYQklBDuQ1cOCt3byTYfmqdWsAAogxIDYTPZoY9HU0GWpLssGaQQBkwN5DxxgOHDkBD9tvXz+vuX31QitAALH8/v2nJSLQJz0qxJcBGezYexCuecaC5Qw3rt9Ys3fTsg4kJa9BrgUIIJZ///6m+/u4M7z68IXh0+cvDHy8PAxvXr2EO3va3CUM129cX3Ngy6piIPcxSCwxv/YfiFaREysBCCCWv8D4/fztJ0NiRh7Ib+/8fTyFAn29GN69ecWwbM1GhitXr6yRlVP8AdT0ENmFM7prGfJLqnsAAojp6+ePa+JSsxhA9IXj+4PWbdj06u279wwCQqIMp86eZzi8fS3QZsaY0rx0BhsLUwYQDQJ3H79i+PSTgQEggFiO7toAchrIb68dfMKrgK4QExIQYPj77x8DML4ZYM6+euUKw+dPH8E0MgAIIBaghkfAqHkMSuD2PuHp+zYuY3j88iPDuo2bGb5+/bIGpOjB3Ztrp895EgzTJK+kAjaIh/0fA0AAMYLiFARAydbUwWsVOydXCIj/8/u3NU/u3Wx99vDOBaCUHFBIFGaAk2/kGRCtLCs2CSCA4AZADUFWCI4moPwfBjQAVGcMZT4BCDAAVE+Dr1XMs78AAAAASUVORK5CYII="
		});
		this.mainLayout.addStyleClass("org-scn-MainLayout");
		// this.mainLayout.addContent(this.appHeader);
		
		//this.mainLayout.addStyleClass("org-scn-ApsBody");
		
		// Get Property Metadata from Design Studio Component Runtime.
		this.isTest = this.getUrlParameterByName("testMode") == "X";
		var propMetadata = {};
		if(this.componentInstance != undefined) {
			propMetadata = this.componentInstance.getPropertyMetaData();
		} else {
			if(!this.isTest){
				propMetadata = this.callRuntimeHandler("getPropertyMetaData");	
			} else {
				var testComponent = this.getUrlParameterByName("component");
				var testComponent = testComponent.substring(0, testComponent.indexOf(","));
				var componentObject = eval(testComponent);
				
				this.componentInstance = componentObject.instance();
				propMetadata = this.componentInstance.getPropertyMetaData();
			}
		}
		
		this.metaProps = jQuery.parseJSON(propMetadata);
		
		this.getIndexForCategory = function (cat) {
			if(cat.indexOf("Data") == 0) {return 10;}
			if(cat.indexOf("Display") == 0) {return 20;}
			if(cat.indexOf("Interaction") == 0) {return 30;}
			if(cat.indexOf("Image") == 0) {return 40;}
			if(cat.indexOf("Content") == 0) {return 50;}
			if(cat.indexOf("Special") == 0) {return 60;}
			if(cat.indexOf("Prototypes") == 0) {return 70;}
			return 100;
		};
		var that = this;
		
		this.metaProps.sort(function(a, b) {
			var res = that.getIndexForCategory(a.opts.cat)-that.getIndexForCategory(b.opts.cat);

			if(res == 0) {
				// then sort placing boolean "Use" first
				if (a.opts.desc.indexOf("Use") == 0 && b.opts.desc.indexOf("Use") == 0){
					// continue
				} else if (a.opts.desc.indexOf("Use") == 0){
				   return -1;
			    } else if (b.opts.desc.indexOf("Use") == 0){
				   return 1;
			    }
				if (a.type) {
					if (a.type.indexOf("bool") == 0 && b.type.indexOf("bool") == 0){
						// continue
					} else if (a.type.indexOf("bool") == 0){
					   return -1;
				    } else if (b.type.indexOf("bool") == 0){
					   return 1;
				    }
				}

				// alphabet
				 var A = a.opts.desc.toLowerCase();
			     var B = b.opts.desc.toLowerCase();

			     if (A > B){
			        return 1;
			     }else if (A < B){
			    	res = -1;
			     } else{
			    	res = 0;
			     }
			}

			 return res;
		});
		
		this.props = {};
		// Pass 1 - Create tree.
		this.tree = {
			key : "",
			title : "Properties",
			nodes : [],
			leafs : []
		};
		var generalFilled = false;
		for(var prop in this.metaProps){
			var property = this.metaProps[prop].name;
			var propertyOptions = this.metaProps[prop].opts;
			if(!propertyOptions.cat){
				// Add a General Tab to tree.
				/*
				 if(!generalFilled) this.tree.nodes.splice(0,0,{
					key : "General",
					title : "General",
					nodes : [],
					leafs : []
				});
				generalFilled = true;
				*/
				propertyOptions.cat = "?";
			}
			var category = propertyOptions.cat;
			var catChain = category.split("-");
			var currentNode = this.tree;	// Start at top.
			var nodeName = "";
			var sep = "";
			for(var i=0;i<catChain.length;i++){
				nodeName+=sep+catChain[i];
				if(!currentNode.nodes[nodeName]) currentNode.nodes[nodeName]={
					key : nodeName,
					title : catChain[i],
					nodes : [],
					leafs : []
				}
				sep = "-";
				currentNode = currentNode.nodes[nodeName];
			}
			currentNode.leafs[property] = this.metaProps[prop];
		}
		// Pass 2 - Balance out nodes that contain nodes and leafs.
		this.balance(this.tree);
		// Pass 3 - Create UI Components

		this.render(this.tree,this.mainLayout);

		if(componentInfo && componentInfo.visible){
			this.aboutLayout = new sap.ui.commons.layout.VerticalLayout({
				width : "100%"
			});
			/*this.tree.strip.addItem(new sap.ui.ux3.NavigationItem({
				key:"ABOUT",
				text:"About",
			}));*/
			this.tree.strip.addWorksetItem(new sap.ui.ux3.NavigationItem({
				key:"ABOUT",
				text:"About",
			}));
			aboutPanel = new sap.ui.commons.Panel({
				text : componentInfo.title,
				borderDesign : sap.ui.commons.enums.BorderDesign.None,
				areaDesign : sap.ui.commons.enums.AreaDesign.Transparent,
				width : "100%"
			});

			//this.appHeader.setLogoText("  " + componentInfo.title);
			this.mainLayout.setAppTitle(componentInfo.title);
			//if(componentInfo.icon) this.appHeader.setLogoSrc(componentInfo.icon);
			if(componentInfo.icon) this.mainLayout.setAppIcon(componentInfo.icon);
			//var aboutDescription = new sap.ui.commons.TextView({ text : componentInfo.description});
			var aboutDescription = new sap.ui.core.HTML({ content : "<div>" + componentInfo.description + "</div>"});
			aboutPanel.addContent(aboutDescription);
			this.aboutLayout.addContent(aboutPanel);
			if(componentInfo.topics){
				for(var i=0;i<componentInfo.topics.length;i++){
					var topicPanel = new sap.ui.commons.Panel({
						text : componentInfo.topics[i].title,
						borderDesign : sap.ui.commons.enums.BorderDesign.None,
						areaDesign : sap.ui.commons.enums.AreaDesign.Transparent,
						width : "100%"
					});
					var topicContent = new sap.ui.core.HTML({ content : "<div>" + componentInfo.topics[i].content + "</div>"});
					topicPanel.addContent(topicContent);
					this.aboutLayout.addContent(topicPanel);
				}
			}
		}
		this.mainLayout.placeAt("content");
		} catch(e2) {
			alert(e2.stack);
		}
	};
	this.hLabel = function(label,component){
		var hLayout = new sap.ui.commons.layout.HorizontalLayout({})
		hLayout.addContent(new sap.ui.commons.TextView({ text : label, width : "180px"}));
		hLayout.addContent(component);
		return hLayout;
	}
	
	this.getUrlParameterByName = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
});