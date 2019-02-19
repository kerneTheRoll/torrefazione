module.exports = {
  apiEndpoint: "https://latorrefazione.prismic.io/api/v2",

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  // OAuth
  // clientId: 'xxxxxx',
  // clientSecret: 'xxxxxx',

  // -- Links resolution rules
  // This function will be used to generate links to Prismic.io documents
  // As your project grows, you should update this function according to your routes
  linkResolver: function(doc, ctx) {
    if (doc.type == "page") return `/${doc.lang}/page/${doc.uid}`;
    if (doc.type == "prodotto") return `/${doc.lang}/prodotti/${doc.uid}`;
    if (doc.type == "homepage") return `/${doc.lang}`;
    if (doc.type == "azienda") return `/${doc.lang}/azienda`;

    if (doc.type == "servizi") return `/${doc.lang}/servizi`;
    if (doc.type == "contatti") return `/${doc.lang}/contatti`;
    if (doc.type == "storia") return `/${doc.lang}/storia`;
    if (doc.type == "category") return `/${doc.lang}/categorie/${doc.uid}`;
    return "/";
  }
};
