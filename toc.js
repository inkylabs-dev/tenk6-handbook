// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="01_intro.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li class="chapter-item expanded "><a href="02_why.html"><strong aria-hidden="true">2.</strong> Why Indie Projects Fail</a></li><li class="chapter-item expanded "><a href="03_loop.html"><strong aria-hidden="true">3.</strong> The TenK 6 Methodology</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="04_list.html"><strong aria-hidden="true">4.</strong> List</a></li><li class="chapter-item expanded "><a href="05_pick.html"><strong aria-hidden="true">5.</strong> Pick</a></li><li class="chapter-item expanded "><a href="06_ship.html"><strong aria-hidden="true">6.</strong> Ship</a></li><li class="chapter-item expanded "><a href="07_ask.html"><strong aria-hidden="true">7.</strong> Ask</a></li><li class="chapter-item expanded "><a href="08_measure.html"><strong aria-hidden="true">8.</strong> Measure</a></li><li class="chapter-item expanded "><a href="09_share.html"><strong aria-hidden="true">9.</strong> Share</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="10_retro.html"><strong aria-hidden="true">10.</strong> Reflect</a></li><li class="chapter-item expanded "><a href="11_tracks.html"><strong aria-hidden="true">11.</strong> Growth Tracks</a></li><li class="chapter-item expanded "><a href="12_scale.html"><strong aria-hidden="true">12.</strong> Scaling</a></li><li class="chapter-item expanded "><a href="13_sustain.html"><strong aria-hidden="true">13.</strong> Sustain</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="14_validate.html"><strong aria-hidden="true">14.</strong> Validate Track</a></li><li class="chapter-item expanded "><a href="15_distribute.html"><strong aria-hidden="true">15.</strong> Distribute Track</a></li><li class="chapter-item expanded "><a href="16_monetize.html"><strong aria-hidden="true">16.</strong> Monetize Track</a></li><li class="chapter-item expanded "><a href="17_retain.html"><strong aria-hidden="true">17.</strong> Retain Track</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="18_outro.html"><strong aria-hidden="true">18.</strong> Outro</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
