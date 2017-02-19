(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .component("sdThingSelector", {
            templateUrl: thingSelectorTemplateUrl,
            controller: ThingSelectorController,
            bindings: {
                authz: "<"
            },
        })
        .component("sdThingEditor", {
          templateUrl: thingEditorTemplateUrl,
          controller: ThingEditorController,
          bindings: {
            authz: "<"
          }
    });



    thingSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function thingSelectorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.thing_selector_html;
    }
    thingEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function thingEditorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.thing_editor_html;
    }

    ThingSelectorController.$inject = ["$scope",
        "$stateParams",
        //"spa-demo.authz.Authz",
        "spa-demo.subjects.Thing"];
    function ThingSelectorController($scope, $stateParams, /*Authz,*/ Thing) {
        var vm=this;

        vm.$onInit = function() {
            console.log("ThingSelectorController",$scope);
            /*$scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
                function(){
                    if (!$stateParams.id) {
                        vm.items = Thing.query();
                    }
                });*/
            if(!$stateParams.id){
                vm.items=Thing.query();
            }
        }
        return;
        //////////////
    }

     ThingEditorController.$inject = ["$scope","$q",
                                   "$state","$stateParams",
                                   "spa-demo.subjects.Thing",
                                   "spa-demo.subjects.ThingImage"];
    function ThingEditorController($scope, $q, $state, $stateParams, 
                                 Thing, ThingImage) {
        var vm=this;
        /*vm.selected_linkables=[];*/
        vm.create = create;
        vm.clear  = clear;
        vm.update  = update;
        vm.remove  = remove;
        vm.haveDirtyLinks = haveDirtyLinks;
        vm.updateImageLinks = updateImageLinks;
        /*vm.linkThings = linkThings;*/

        vm.$onInit = function() {
            console.log("ThingEditorController",$scope);
            if ($stateParams.id) {
                //reload($stateParams.id);
                $scope.$watch(function(){ return vm.authz.authenticated }, 
                              function(){ reload($stateParams.id); });
              } else {
                newResource();
              }
        }
        return;
        //////////////
        function newResource() {
            console.log("newResource()");
            vm.item = new Thing();
            //vm.ThingsAuthz.newItem(vm.item);
            return vm.item;
        }

        function reload(ThingId) {
            var itemId = ThingId ? ThingId : vm.item.id;
            console.log("re/loading Thing", itemId);
            vm.item = Thing.get({id:itemId});
            vm.images = ThingImage.query({thing_id:itemId});

            vm.images.$promise.then(
            function(){
              angular.forEach(vm.images, function(ti){
                ti.originalPriority = ti.priority;            
              });                     
            });    

            /*vm.things = ThingThing.query({Thing_id:itemId});
            vm.linkable_things = ThingLinkableThing.query({Thing_id:itemId});
            vm.ThingsAuthz.newItem(vm.item);
            $q.all([vm.item.$promise,
                vm.things.$promise]).catch(handleError);*/

            $q.all([vm.item.$promise,vm.images.$promise]).catch(handleError);    
        }

        function haveDirtyLinks() {
          for (var i=0; vm.images && i<vm.images.length; i++) {
            var ti=vm.images[i];
            if (ti.toRemove || ti.originalPriority != ti.priority) {
              return true;
            }        
          }
          return false;
        }

        function clear() {
            newResource();
            $state.go(".", {id:null});
        }

        function create() {
            $scope.thingform.$setPristine();
            vm.item.errors=null;
            vm.item.$save().then(
                function(){
                    $state.go(".", {id: vm.item.id});
                },
                handleError);
        }

        function update() {      
          vm.item.errors = null;
          var update=vm.item.$update();
          updateImageLinks(update);
        }


        function updateImageLinks(promise) {

          console.log("updating links to images");
          var promises = [];
          if (promise) { promises.push(promise); }
          angular.forEach(vm.images, function(ti){
            if (ti.toRemove) {
              promises.push(ti.$remove());
            } else if (ti.originalPriority != ti.priority) {          
              promises.push(ti.$update());
            }
          });

          console.log("waiting for promises", promises);
          $q.all(promises).then(
            function(response){
              console.log("promise.all response", response); 
              //update button will be disabled when not $dirty
              $scope.thingform.$setPristine();
              reload(); 
            }, 
            handleError);    
        }

        function remove() {
            vm.item.errors = null;
            vm.item.$delete().then(
                function(){
                    console.log("remove complete", vm.item);
                    clear();
                },
                handleError);
        }


        function handleError(response) {
            console.log("error", response);
            if (response.data) {
                vm.item["errors"]=response.data.errors;
            }
            if (!vm.item.errors) {
                vm.item["errors"]={}
                vm.item["errors"]["full_messages"]=[response];
            }
            $scope.thingform.$setPristine();
        }
    }



})();