import jspm from "jspm"
import npmResolve from "resolve"
import fs from "fs"
import path from "path"
import process from "process"

var jspmLoader = null;
try{
  jspmLoader = jspm.Loader();
} catch(ex) {}

function packageFilter(pkg)
{
  if (pkg.style) {
    pkg.main = pkg.style
  }

  // Prefer ES6 Modules
  if (pkg["jsnext:main"]) {
    pkg.main = pkg["jsnext:main"]
  }

  return pkg
}

export default function resolve(id, opts)
{
  // This is required because JSPM does not return files based on "main" or "style"
  // attributes from "package.json" but expect this in most cases.
  var resolveFile = function(path, resolveCallback, rejectCallback)
  {
    npmResolve(".",
    {
      basedir: path,
      extensions: [ ".js", ".css", ".scss", ".sss", ".sass", ".less", ".woff2", ".woff", ".ttf", ".otf", ".eot", ".svg", ".png", ".jpeg", ".webp" ],
      packageFilter
    },
    function(err, result)
    {
      if (err) {
        rejectCallback(err)
      } else {
        resolveCallback(result)
      }
    })
  }

  return new Promise(function(resolveCallback, rejectCallback)
  {
    var basedir = opts && opts.basedir || process.cwd()
    npmResolve(id, {
      basedir: basedir,
      packageFilter
    },
    function(err, npmResult)
    {
      if (err)
      {
        if (!jspmLoader) {
          return rejectCallback(err);
        }

        var isFileRequest = id.indexOf("/") !== -1
        var idFileExt = isFileRequest && path.extname(id) || null

        // console.log("NPM Lookup Failed: ", err);
        jspmLoader.normalize(id).then(function(jspmResult)
        {
          // Convert to non-url real usable file system path
          jspmResult = jspmResult.replace("file://", "")

          // The JSPM normalization falls back to working directory + ID even if the
          // file / directory does not exist.
          fs.lstat(jspmResult, function(err, statResult)
          {
            if (err)
            {
              let resolvedExt = path.extname(jspmResult)
              if (idFileExt !== resolvedExt)
              {
                let jspmResultFixed = jspmResult.slice(0, -resolvedExt.length)
                fs.lstat(jspmResultFixed, function(err)
                {
                  if (err) {
                    rejectCallback(err)
                  } else {
                    resolveCallback(jspmResultFixed)
                  }
                })

                return
              }

              rejectCallback("No such file or directory: " + jspmResult)
            }
            else
            {
              let resolvedToFile = statResult.isFile()
              if (!resolvedToFile) {
                return resolveFile(jspmResult, resolveCallback, rejectCallback)
              }

              resolveCallback(jspmResult)
            }
          })
        }).
        catch(function(jspmError) {
          rejectCallback(jspmError)
        })
      }
      else
      {
        resolveCallback(npmResult)
      }
    })
  })
}
