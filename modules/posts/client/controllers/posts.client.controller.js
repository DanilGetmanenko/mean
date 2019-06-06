(function () {
  'use strict';

  // Posts controller
  angular
    .module('posts')
    .controller('PostsController', PostsController);

  PostsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'postResolve'];

  function PostsController ($scope, $state, $window, Authentication, post) {
    var vm = this;

    vm.authentication = Authentication;
    vm.post = post;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    
    vm.comment = null;
    vm.createComment = createComment;
    vm.deleteComment = deleteComment;

    // Remove existing Post
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.post.$remove($state.go('posts.list'));
      }
    }

    // Save Post
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.postForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.post._id) {
        vm.post.$update(successCallback, errorCallback);
      } else {
        vm.post.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('posts.view', {
          postId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function createComment() {
      if (vm.comment) {
        vm.post.comments.push({comment:vm.comment});
        vm.post.$update(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('posts.view', {
          postId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
    
    function deleteComment(_id) {
      var commentIndex = -1;
      var comment= vm.post.comments.find(function(v, i){
        if (v._id==_id){
          commentIndex=i;
         return true;
        }
      })

      if (comment){
        vm.post.comments.splice(commentIndex, 1);
        vm.post.$update(successCallback, errorCallback);

      }
      
      function successCallback(res) {
        $state.go('posts.view', {
          postId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
