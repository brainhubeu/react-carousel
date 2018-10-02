var Webpack = require("webpack");
var expect = require("chai").expect;
var Config = require("../");

describe("merge", function() {

    beforeEach(function() {
        this.config = new Config();
    });

    it("should accept either an object or a function", function() {
        var config = this.config;
        var valid = [{}, function() {}, []];
        var invalid = ["", true, false, 5, undefined, null];
        
        valid.forEach(function(validParameter) {
            expect(function() {
                config.merge(validParameter);
            }).not.to.throw();
        });
        
        invalid.forEach(function(invalidParameter) {
            expect(function() {
                config.merge(invalidParameter);
            }).to.throw("Invalid Parameter. You must provide either an object or a function.");
        });
    });

    it("should provide a copy of the current configuration when a function is passed", function() {
        this.config.merge(function(current) {
            expect(current).to.exist;
            
            // Mutating this object should not cause any side effects unless returned.
            current.entry = "./main.js";
            
            // Show the object isn't in any way connected.
            expect(this.config.resolve()).to.eql({});
            
            // Completely ignore the current configuration to demonstrate the first claim.
            return {
                devtool: "inline-source-map"
            };
        }.bind(this));
        
        expect(this.config.resolve()).to.eql({
            devtool: "inline-source-map"
        });
    });

    it("should reference (not clone) complex objects when a function is passed", function() {
        var definePlugin = new Webpack.DefinePlugin({
            VERSION: JSON.stringify("1.0.0")
        });
        var plugins;
        
        this.config.merge(function() {
            return {
                plugins: [
                    definePlugin
                ]
            };
        });

        plugins = this.config.resolve().plugins;

        // Ensure it's a reference and not a clone.
        expect(plugins[0]).to.eq(definePlugin);

        // Just to for sanity sake. If it was cloned, this would fail.
        expect(plugins[0]).not.to.eq(
            new Webpack.DefinePlugin({
                VERSION: JSON.stringify("1.0.0")
            })
        );
       
    });

    it("should return the config instance to allow chaining", function() {
        var config = this.config.merge({
            entry: "./main.js"
        });
        
        expect(config).to.eq(this.config);
    });
    
    describe("examples (using objects)", function() {
        
        it("should successfully merge a simple configuration object", function() {
            var config = {
                entry: "./main.js",
                output: {
                    filename: "bundle.js"
                }
            };

            this.config.merge(config);

            // Shouldn't be a reference, just needs to deeply equal.
            expect(this.config.resolve()).to.eql(config);
        });
        
        it("should allow multiple calls to config.merge", function() {
            this.config
                .merge({
                    entry: "./main.js",
                    output: {
                        filename: "bundle.js"
                    }
                })
                .merge({
                    output: {
                        path: __dirname + "/dist"
                    }
                });
            
            expect(this.config.resolve()).to.eql({
                entry: "./main.js",
                output: {
                    path: __dirname + "/dist",
                    filename: "bundle.js"
                }
            });
        });
        
        it("should merge arrays using concatenation", function() {
            this.config.merge({
                entry: [
                    "screens/a.js",
                    "screens/b.js",
                    "screens/c.js"
                ],
                output: {
                    filename: "bundle.js"
                }
            });

            this.config.merge({
                entry: [
                    "screens/d.js",
                    "screens/e.js",
                    "screens/f.js"
                ]
            });
            
            expect(this.config.resolve()).to.eql({
                entry: [
                    "screens/a.js",
                    "screens/b.js",
                    "screens/c.js",
                    "screens/d.js",
                    "screens/e.js",
                    "screens/f.js"
                ],
                output: {
                    filename: "bundle.js"
                }
            });
        });
        
    });
    
    describe("examples (using functions)", function() {
        
        it("should successfully merge a simple configuration function", function() {
            this.config.merge(function(current) {
                current.entry = "./main.js",
                current.output = {
                    filename: "bundle.js"
                };

                return current;
            });

            expect(this.config.resolve()).to.eql({
                entry: "./main.js",
                output: {
                    filename: "bundle.js"
                }
            });
        });
        
        it("should allow multiple calls to config.merge", function() {
            this.config
                .merge(function(current) {
                    current.entry = "./main.js",
                    current.output = {
                        filename: "bundle.js"
                    };

                    return current;
                })
                .merge(function(current) {
                    current.output.path = __dirname + "/dist";

                    return current;
                });
            
            expect(this.config.resolve()).to.eql({
                entry: "./main.js",
                output: {
                    path: __dirname + "/dist",
                    filename: "bundle.js"
                }
            });
        });
        
        it("should replace the current configuration with the returned value", function() {
            this.config
                .merge(function(current) {
                    current.entry = "./main.js",
                    current.output = {
                        filename: "bundle.js"
                    };
                    
                    return current;
                })
                .merge(function() {
                    return {
                        devtool: "inline-source-map"
                    };
                });
            
            expect(this.config.resolve()).to.eql({
                devtool: "inline-source-map"
            });
        });
        
    });
    
});
