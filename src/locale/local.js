import fr from "./fr.json";
import de from "./de.json";
import es from "./es.json";
import en from "./en.json";
import it from "./it.json";
import nl from "./nl.json";
import pt from "./pt.json";

const lang = {
    fr,
    de,
    es,
    en,
    it,
    nl,
    pt,
};

export const setAppLocale = (codeLangue) => {
    let trad = "fr";
    if (codeLangue === "109") {
        trad = "de";
    }
    if (codeLangue === "134") {
        trad = "es";
    }
    if (codeLangue === "132") {
        trad = "en";
    }
    if (codeLangue === "127") {
        trad = "it";
    }
    if (codeLangue === "135") {
        trad = "nl";
    }
    if (codeLangue === "139") {
        trad = "pt";
    }
    return trad;
};

export const traduction = (codeMot = "NOT_DEFINE", codeLangue) => {
    let locale = setAppLocale(codeLangue);
    return lang[locale].hasOwnProperty(codeMot) ? lang[locale][codeMot] : lang[locale].NOT_DEFINE;
};
