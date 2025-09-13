const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

module.exports = {
  input: ["src/**/*.{ts,tsx,js,jsx}"],
  output: "./public/locales/$LOCALE/$NAMESPACE.json",
  options: {
    debug: true,
    removeUnusedKeys: false,
    sort: true,
    lngs: ["en", "ru", "kk"],
    ns: ["translation"],
    defaultLng: "en",
    defaultNs: "translation",
    keySeparator: false,
    nsSeparator: false,
    interpolation: {
      prefix: "{{",
      suffix: "}}",
    },
    defaultValueTemplate: (lng, ns, key) => key, 
  },
  transform: function (file, enc, done) {
    const content = fs.readFileSync(file.path, enc);

    // Compile TSX/JSX into plain JS so scanner can read it
    
    babel.transform(
      // @ts-ignore
      content,
      {
        filename: file.path,
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
      },
      function (err, result) {
        if (err) return done(err);

        // Pass transpiled content into scanner's parser
        this.parser.parseFuncFromString(result.code, { list: ["t"] }, (key) => {
          this.parser.set(key, {});
        });

        this.parser.parseTransFromString(result.code, {}, (key) => {
          this.parser.set(key, {});
        });

        done();
      }.bind(this) 
    );
  },
};
