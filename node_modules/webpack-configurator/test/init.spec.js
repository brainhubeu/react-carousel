var expect = require("chai").expect;
var Config = require("../");

describe("instantiation", function() {

    beforeEach(function() {
        this.config = new Config();
    });
    
    it("should provide functionality for merging existing configuration objects", function() {
        expect(this.config.merge).to.be.an.instanceof(Function);
    });

    it("should provide functionality for creating loaders, pre-loaders, and post-loaders", function() {
        var methods = [
            "preLoader",
            "loader",
            "postLoader",
        ];

        methods.forEach(function(method) {
            expect(this.config[method]).to.be.an.instanceof(Function);
        }, this);
        
    });

    it("should provide functionality for creating plugins", function() {
        expect(this.config.plugin).to.be.an.instanceof(Function);
    });

    it("should provide a way to remove loaders and plugins", function() {
        var methods = [
            "removePreLoader",
            "removeLoader",
            "removePostLoader",
            "removePlugin"
        ];

        methods.forEach(function(method) {
            expect(this.config[method]).to.be.an.instanceof(Function);
        }, this);
    });

    it("should provide the ability to resolve the composed configuration into an object for Webpack", function() {
        expect(this.config.resolve).to.be.an.instanceof(Function);
    });
        
});
