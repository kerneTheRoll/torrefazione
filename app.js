const Prismic = require("prismic-javascript");
const { RichText, Link } = require("prismic-dom");
const app = require("./config");
const config = require("./prismic-configuration");
const PORT = app.get("port");
const Cookies = require("cookies");
const nodemailer = require("nodemailer");
const Cred = require("./creds");
//Must be at the end so it go through the Prismic middleware because ended up in the final route
const I18N = require("./i18n.json");
//provide a lang parameter in the route
function I18NUrl(urlPart) {
  return `/:lang(${I18N.languages.map(l => l.key).join("|")})${urlPart || ""}`;
}

function saluta() {}

function I18NConfig(req, options) {
  return Object.assign(options || {}, { lang: req.params.lang });
}

app.listen(PORT, () => {
  console.log(`Go to browser: http://localhost:${PORT}`);
});

//Middleware catch all request, query Prismic API and configure everything for it
app.use((req, res, next) => {
  //init prismic context
  res.locals.ctx = {
    endpoint: config.apiEndpoint,
    linkResolver: config.linkResolver
  };
  //put RichText Helper from Prismic DOM to simplify convert RichText from json to html
  res.locals.RichText = RichText;
  //put Link helper from Prismic DOM to simplify getting url from link
  res.locals.Link = Link;
  res.locals.active = "";

  Prismic.api(config.apiEndpoint, {
    accessToken: config.accessToken,
    req
  })
    .then(api => {
      req.prismic = { api };
      //continue spreading request
      next();
    })
    .catch(error => {
      //next with params handle error natively in express
      res.status(404).send(error.message);
    });
});
/**nodemail api */
function gestisciEmail(req, res, next) {
  var message = "";
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        type: "OAuth2",
        user: Cred.user,
        clientId: Cred.clientId,

        clientSecret: Cred.clientSecret,
        refreshToken: Cred.refreshToken
      }
    });
    // bisogna controllare!!!!
    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const email = req.body.email;

    const country = req.body.country;
    const cap = req.body.cap;
    const citta = req.body.citta;
    const telefono = req.body.telefono;
    const richiesta = req.body.richiesta;
    const scelta = req.body.scelta;

    // setup email data with unicode symbols
    let mailOptions = {
      to: "abdimohamed862992@gmail.com", // list of receivers
      subject: "richiesta da parte di " + nome + " per " + scelta, // Subject line
      text:
        "Buona sera, una richiesta  a nome di  " +
        nome +
        " " +
        cognome +
        " numero di telefono " +
        telefono +
        " la richiesta scritta è " +
        richiesta +
        " effettuata da localita " +
        country +
        " cap " +
        cap +
        " città " +
        citta
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        req.message =
          "Non è stato possibile inviare il messaggio, riprovare più tardi";
      } else {
        res.status(200).send({
          message: "La Sua richiesta è stata inviata"
        });
      }

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
}

/** end nodmail api */
//middleware to setup prismic profiles
app.use((req, res, next) => {
  const cookies = new Cookies(req, res);
  const profilesSettings = require("./profiles.json") || {};
  res.locals.PrismicProfiles = Object.assign(profilesSettings, {
    current: cookies.get("prismic.profile") || profilesSettings.default
  });
  next();
});

app.use(I18NUrl(), (req, res, next) => {
  res.locals.I18N = Object.assign(I18N, { current: req.params.lang });
  next();
});

//Middleware that query menu in prismic for each GET request
app.use(I18NUrl(), (req, res, next) => {
  req.prismic.api
    .getSingle("menu", I18NConfig(req))
    .then(menu => {
      req.prismic.api
        .query(Prismic.Predicates.at("document.type", "category"))
        .then(function(response) {
          res.locals.categ = response.results;
          res.locals.menu = menu;

          next();
        })
        .catch(err => {
          next(`Error getting menu from prismic: ${error.message}`);
        });
    })
    .catch(err => {
      next(`Error getting menu from prismic: ${error.message}`);
    });
});
function getCategoria(req, res, next) {
  const uid = req.params.uid;
  req.prismic.api
    .getByUID("category", uid, I18NConfig(req))
    .then(categoria => {
      if (!categoria) {
        res.status(404).send("page not found");
      } else {
        req.categoria = categoria;
        console.log(categoria);
      }

      next();
    })
    .catch(error => {
      next(`error when retriving page ${error.message}`);
    });
}

// fetch dei prodotti che hanno la categoria del parametro passato : uid
// io prendo poi l'id del documento e lo vado a fetchare dal mio campo "collegamento a un documento"
function getProdottoSimile(req, res, next) {
  const id = req.categoria.id;

  req.prismic.api
    .query(
      [
        Prismic.Predicates.at("document.type", "prodotto"),

        Prismic.Predicates.at("my.prodotto.categoria", id)
      ],
      I18NConfig(req)
    )
    .then(function(response) {
      // response is the response object, response.results holds the documents

      req.prodottoFiglio = response.results;

      next();
    })
    .catch(error => {
      next("error " + error.message);
    });
}
function renderCategoria(req, res) {
  /*  req.prodottoFiglio.forEach(ele => {
    ele.data.ingredienteAbdi.forEach(ele2 => {
      console.log(ele.uid);
      console.log(ele2);
    });
  }); */
  res.render("categorie", {
    title: "Categorie",
    categoria: req.categoria.uid,
    categories: req.categoria,
    categorie: req.prodottoFiglio
  });
}
app.get(
  I18NUrl("/categorie/:uid"),
  getCategoria,
  getProdottoSimile,

  renderCategoria
);
//redirect / to default language from i18n.json
app.get("/", (req, res, next) => {
  res.redirect(I18N.default);
});

// Route for the homepage
app.get(I18NUrl("/"), (req, res, next) => {
  req.prismic.api
    .getSingle("homepage", I18NConfig(req))
    .then(home => {
      req.prismic.api
        .query(
          [
            Prismic.Predicates.at("document.type", "prodotto"),
            Prismic.Predicates.at("my.prodotto.mostra_in_home", 1)
          ],

          I18NConfig(req)
        )
        .then(function(response) {
          // response is the response object, response.results holds the documents

          res.render("homepage", {
            home: home,
            prodotto: response.results,
            title: "LatorrefazioneDelConte"
          });
        });
    })
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
});
app.get(I18NUrl("/servizi"), (req, res, next) => {
  req.prismic.api
    .getSingle("servizi", I18NConfig(req))
    .then(servizio => {
      res.render("Servizi", { servizio: servizio, title: "servizi" });
    })
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
});
app.get(I18NUrl("/storia"), (req, res, next) => {
  req.prismic.api
    .getSingle("storia", I18NConfig(req))
    .then(storia => {
      res.render("storia", { storia: storia, title: "storia" });
    })
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
});
app.get(I18NUrl("/contatti"), (req, res, next) => {
  req.prismic.api
    .getSingle("contatti", I18NConfig(req))
    .then(contatti => {
      res.render("contatti", {
        contatti: contatti,
        color: "bianco",
        title: "contatti"
      });
    })
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
});
function getContatti(req, res, next) {
  req.prismic.api
    .getSingle("contatti", I18NConfig(req))
    .then(contatti => {
      req.contatti = contatti;

      next();
    }, I18NConfig(req))
    .catch(error => {
      next(`error when retriving homepage ${error.message}`);
    });
}
app.post(I18NUrl("/contatti"), getContatti, gestisciEmail);
// Route for pages
app.get(I18NUrl("/page/:uid"), (req, res, next) => {
  const uid = req.params.uid;

  req.prismic.api
    .getByUID("page", uid, I18NConfig(req))
    .then(page => {
      if (!page) res.status(404).send("page not found");
      else res.render("page", { page });
    })
    .catch(error => {
      next(`error when retriving page ${error.message}`);
    });
});

app.get(I18NUrl("/prodotti/:uid"), (req, res, next) => {
  const uid = req.params.uid;
  let number = 0;
  req.prismic.api.getByUID("prodotto", uid, I18NConfig(req)).then(prodotto => {
    req.categoriaScelta = prodotto.data.categoria.uid;
    req.prodotto = prodotto;
    req.prismic.api
      .query(
        Prismic.Predicates.at("document.type", "prodotto"),
        I18NConfig(req)
      )

      .then(function(response) {
        // response is the response object, response.results holds the documents
        /***qui potrei chiamare la pagina prodotto che ospita e mi da solo la lingua */

        /****************+fine  */
        rispostaFiltrata = response.results.filter(elemento => {
          return elemento.data.categoria.uid === req.categoriaScelta;
        });

        // console.log(response.results);
        //console.log("passato paramento " + uid);
        // res.render("homepage", { home: home, prodotto: response.results });

        res
          .render("prodotto", {
            prodotti: req.prodotto,
            prodotto: rispostaFiltrata,
            numero: uid,
            categoria: req.categoriaScelta,
            title: "prodotto"
          })
          .catch(error => {
            next(`error when retriving homepage ${error.message}`);
          });
      });
  });
});

//preview
app.get("/preview", (req, res) => {
  const token = req.query.token;
  if (token) {
    req.prismic.api
      .previewSession(token, config.linkResolver, "/")
      .then(url => {
        const cookies = new Cookies(req, res);
        cookies.set(Prismic.previewCookie, token, {
          maxAge: 30 * 60 * 1000,
          path: "/",
          httpOnly: false
        });
        res.redirect(302, url);
      })
      .catch(err => {
        res.status(500).send(`Error 500 in preview: ${err.message}`);
      });
  } else {
    res.send(400, "Missing token from querystring");
  }
});
