chrome.storage.local.get('extensionEnabled', data => {
    if (data.extensionEnabled) {
        initContentScript();
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === 'extensionEnabled' && newValue === true) {
            initContentScript();
        }
    }
});

function initContentScript() {

    const sponsoredTextPatterns = [
        "Collaboration commerciale",
        "#sponsored",
        "#sponsorisée",
        "\\(collaboration commerciale\\)",
        "\\[collaboration commerciale\\]",
        "Commercial collaboration",
        "#CollaborationCommerciale",
        "collaboration commerciale",
        "collaboration publicitaire",        
        "#ad",
        "#ads",
        "#pub",
        "#sponsoring",
        "#partenariat",
        "#sponsorisé",
        "#advertisement",
        "#marketing",
        "#sponsorship",
        "Patrocinio",
        "Contenido patrocinado",
        "#patrocinado",
        "#publicidad",
        "Placement de produit",
        "Product placement",
        "Colocación de producto",
        "#affiliatelink",
        "#affiliatelinks",
        "#brandambassador",
        "#paidpartnership",
        "#paidad"
    ];

    const sponsoredTextRegex = new RegExp(sponsoredTextPatterns.join('|'), 'i');

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                removeSponsoredArticles();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function removeSponsoredArticles() {
        document.querySelectorAll('article').forEach(article => {
            if (sponsoredTextRegex.test(article.textContent)) {
                article.remove();
            }
        });
    }
}
