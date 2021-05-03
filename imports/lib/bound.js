//Solution for Error: Meteor code must always run within a Fiber. Try wrapping callbacks that you pass to non-Meteor libraries with Meteor.bindEnvironmen
export default Meteor.bindEnvironment((callback) => {callback();});
