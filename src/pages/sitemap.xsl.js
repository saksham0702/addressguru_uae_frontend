// pages/sitemap.xsl.js
export default function SitemapXSL() {
  return null;
}

export async function getServerSideProps({ res }) {
  const xsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:html="http://www.w3.org/1999/xhtml"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <!-- ============================================================
       HELPER: extract value from comment like "urlCount:123 image:..."
       Usage: call with node=. and key='urlCount' or key='image'
       ============================================================ -->
  <xsl:template name="commentValue">
    <xsl:param name="commentText"/>
    <xsl:param name="key"/>
    <xsl:variable name="afterKey" select="substring-after($commentText, concat($key, ':'))"/>
    <xsl:choose>
      <xsl:when test="contains($afterKey, ' ')">
        <xsl:value-of select="normalize-space(substring-before($afterKey, ' '))"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="normalize-space($afterKey)"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Sitemap Dashboard | AddressGuru</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style type="text/css">
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&amp;display=swap');

          :root {
            --primary: #fb923c;
            --primary-glow: rgba(251, 146, 60, 0.4);
            --bg: #0b0f1a;
            --surface: #161e2d;
            --surface-hover: #1f2937;
            --text-main: #f3f4f6;
            --text-dim: #9ca3af;
            --border: rgba(255,255,255,0.08);
            --glass: rgba(255,255,255,0.03);
          }

          * { margin:0; padding:0; box-sizing:border-box; }

          body {
            font-family: 'Outfit', sans-serif;
            background: var(--bg);
            color: var(--text-main);
            padding: 40px 20px;
            background-image:
              radial-gradient(circle at 10% 20%, rgba(251,146,60,0.05) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(244,63,94,0.05) 0%, transparent 40%);
            min-height: 100vh;
          }

          .dashboard { max-width: 1280px; margin: 0 auto; }

          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding: 20px;
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 24px;
          }

          .brand { display:flex; align-items:center; gap:12px; }

          .logo-box {
            width:40px; height:40px;
            background: linear-gradient(135deg, var(--primary), #f43f5e);
            border-radius:12px;
            display:flex; align-items:center; justify-content:center;
            font-weight:700; font-size:20px; color:white;
            box-shadow: 0 0 20px var(--primary-glow);
          }

          .brand-name h1 { font-size:20px; font-weight:600; letter-spacing:-0.5px; }
          .brand-name p  { font-size:12px; color:var(--text-dim); }

          .stats-container {
            display:grid;
            grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
            gap:20px;
            margin-bottom:30px;
          }

          .stat-tile {
            background:var(--surface);
            border:1px solid var(--border);
            padding:24px; border-radius:24px;
            position:relative; overflow:hidden;
            transition:transform 0.3s, border-color 0.3s;
          }
          .stat-tile:hover { transform:translateY(-5px); border-color:var(--primary); }
          .stat-tile::before {
            content:''; position:absolute; top:0; right:0;
            width:80px; height:80px;
            background:radial-gradient(circle at 100% 0%, var(--primary-glow), transparent 70%);
          }

          .stat-number { font-size:36px; font-weight:700; margin-bottom:4px; }
          .stat-label  { color:var(--text-dim); font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px; }

          .main-content {
            background:var(--surface);
            border:1px solid var(--border);
            border-radius:32px;
            overflow:hidden;
            box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);
          }

          .content-header {
            padding:24px;
            border-bottom:1px solid var(--border);
            display:flex; justify-content:space-between; align-items:center;
            background:rgba(255,255,255,0.02);
          }

          .search-wrapper { position:relative; width:100%; max-width:400px; }
          .search-wrapper input {
            width:100%;
            background:var(--bg);
            border:1px solid var(--border);
            padding:12px 16px 12px 44px;
            border-radius:14px;
            color:white; font-family:inherit; outline:none;
            transition:all 0.3s;
          }
          .search-wrapper input:focus {
            border-color:var(--primary);
            box-shadow:0 0 0 4px var(--primary-glow);
          }
          .search-icon {
            position:absolute; left:16px; top:50%;
            transform:translateY(-50%); color:var(--text-dim);
          }

          .table-scroll { overflow-x:auto; }

          table { width:100%; border-collapse:collapse; }

          th {
            padding:20px 24px; text-align:left;
            font-size:12px; font-weight:600; color:var(--text-dim);
            text-transform:uppercase; letter-spacing:1px;
            background:rgba(0,0,0,0.2); cursor:pointer; white-space:nowrap;
          }
          th:hover { color:var(--primary); }

          td { padding:18px 24px; border-bottom:1px solid var(--border); vertical-align:middle; }
          tr:last-child td { border-bottom:none; }
          tr:hover td { background:var(--surface-hover); }

          .url-cell { display:flex; align-items:center; gap:12px; }
          .url-text {
            color:var(--text-main); text-decoration:none;
            font-weight:500; transition:color 0.2s; word-break:break-all;
          }
          .url-text:hover { color:var(--primary); }

          .img-wrap {
            width:54px; height:54px; border-radius:12px;
            overflow:hidden; background:var(--bg);
            border:1px solid var(--border); flex-shrink:0;
          }
          .img-wrap img { width:100%; height:100%; object-fit:cover; }

          .badge {
            padding:6px 12px; border-radius:10px;
            font-size:13px; font-weight:600; display:inline-block;
          }
          .badge-count { background:rgba(59,130,246,0.1); color:#60a5fa; border:1px solid rgba(59,130,246,0.2); }
          .badge-freq  { background:rgba(16,185,129,0.1); color:#34d399; border:1px solid rgba(16,185,129,0.2); }
          .badge-prio  { background:rgba(251,146,60,0.1);  color:#fbbf24; border:1px solid rgba(251,146,60,0.2);  }

          .copy-btn {
            padding:6px; background:transparent; border:none;
            color:var(--text-dim); cursor:pointer; border-radius:6px; transition:all 0.2s;
          }
          .copy-btn:hover { background:var(--bg); color:var(--primary); }

          footer { margin-top:40px; text-align:center; color:var(--text-dim); font-size:14px; }

          @media (max-width:768px) {
            .stats-container { grid-template-columns:1fr; }
            .content-header { flex-direction:column; gap:20px; }
            .search-wrapper { max-width:100%; }
          }
        </style>
        <script type="text/javascript">
          <![CDATA[
          // Parse <!-- urlCount:N image:URL --> comments on each <sitemap> row
          // We embed these as data-* on <tr> during XSL, then JS reads them.

          function sortTable(n) {
            var table = document.getElementById("sitemapTable");
            var switching = true, dir = "asc", switchcount = 0;
            while (switching) {
              switching = false;
              var rows = table.rows;
              for (var i = 1; i < rows.length - 1; i++) {
                var x = rows[i].getElementsByTagName("TD")[n];
                var y = rows[i+1].getElementsByTagName("TD")[n];
                var xv = x.textContent.trim().toLowerCase();
                var yv = y.textContent.trim().toLowerCase();
                var isNum = !isNaN(parseFloat(xv.replace(/[^0-9.]/g,""))) && !isNaN(parseFloat(yv.replace(/[^0-9.]/g,"")));
                var swap = false;
                if (isNum) {
                  swap = dir === "asc"
                    ? parseFloat(xv.replace(/[^0-9.]/g,"")) > parseFloat(yv.replace(/[^0-9.]/g,""))
                    : parseFloat(xv.replace(/[^0-9.]/g,"")) < parseFloat(yv.replace(/[^0-9.]/g,""));
                } else {
                  swap = dir === "asc" ? xv > yv : xv < yv;
                }
                if (swap) { rows[i].parentNode.insertBefore(rows[i+1], rows[i]); switching = true; switchcount++; break; }
              }
              if (!switching && switchcount === 0 && dir === "asc") { dir = "desc"; switching = true; }
            }
          }

          function filterTable() {
            var filter = document.getElementById("searchInput").value.toLowerCase();
            var rows = document.getElementById("sitemapTable").getElementsByTagName("tr");
            for (var i = 1; i < rows.length; i++) {
              var found = Array.from(rows[i].getElementsByTagName("td"))
                .some(function(td){ return td.textContent.toLowerCase().indexOf(filter) > -1; });
              rows[i].style.display = found ? "" : "none";
            }
          }

          async function copyToClipboard(text, btn) {
            try {
              await navigator.clipboard.writeText(text);
              var orig = btn.innerHTML;
              btn.innerHTML = "&#10003;"; btn.style.color = "#10b981";
              setTimeout(function(){ btn.innerHTML = orig; btn.style.color = ""; }, 2000);
            } catch(e) {}
          }
          ]]>
        </script>
      </head>
      <body>
        <div class="dashboard">
          <header class="navbar">
            <div class="brand">
              <div class="logo-box">A</div>
              <div class="brand-name">
                <h1>AddressGuru Sitemap</h1>
                <p>Enterprise Search Engine Index Optimization</p>
              </div>
            </div>
          </header>

          <xsl:choose>

            <!-- ══════════════════════════════════════════════
                 SITEMAPINDEX VIEW
                 urlCount + image extracted from XML comments
                 ══════════════════════════════════════════════ -->
            <xsl:when test="sitemap:sitemapindex">

              <!-- Count total urls by summing comment urlCount values via JS after render -->
              <div class="stats-container">
                <div class="stat-tile">
                  <div class="stat-number"><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></div>
                  <div class="stat-label">Sitemaps Indexed</div>
                </div>
                <div class="stat-tile">
                  <div class="stat-number" id="totalUrlCount">—</div>
                  <div class="stat-label">Total URLs</div>
                </div>
              </div>

              <div class="main-content">
                <div class="content-header">
                  <div class="search-wrapper">
                    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input id="searchInput" type="text" placeholder="Filter sitemaps…" oninput="filterTable()"/>
                  </div>
                </div>
                <div class="table-scroll">
                  <table id="sitemapTable">
                    <thead>
                      <tr>
                        <th onclick="sortTable(0)">Sitemap Path</th>
                        <th onclick="sortTable(1)">URL Count</th>
                        <th onclick="sortTable(2)">Last Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                        <!-- child::comment()[1] reliably selects the first comment node -->
                        <xsl:variable name="commentText" select="normalize-space(child::comment()[1])"/>
                        <xsl:variable name="rawAfterCount" select="substring-after($commentText, 'urlCount:')"/>
                        <xsl:variable name="urlCount">
                          <xsl:choose>
                            <xsl:when test="contains($rawAfterCount, ' ')">
                              <xsl:value-of select="normalize-space(substring-before($rawAfterCount, ' '))"/>
                            </xsl:when>
                            <xsl:when test="string-length($rawAfterCount) &gt; 0">
                              <xsl:value-of select="normalize-space($rawAfterCount)"/>
                            </xsl:when>
                            <xsl:otherwise>0</xsl:otherwise>
                          </xsl:choose>
                        </xsl:variable>

                        <tr>
                          <td>
                            <div class="url-cell">
                              <a class="url-text" href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                              <button class="copy-btn" onclick="copyToClipboard('{sitemap:loc}', this)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                              </button>
                            </div>
                          </td>
                          <td>
                            <span class="badge badge-count">
                              <xsl:choose>
                                <xsl:when test="string-length($urlCount) &gt; 0"><xsl:value-of select="$urlCount"/></xsl:when>
                                <xsl:otherwise>—</xsl:otherwise>
                              </xsl:choose>
                            </span>
                          </td>
                          <td style="color:var(--text-dim)">
                            <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                          </td>
                        </tr>
                      </xsl:for-each>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Sum urlCounts by reading the rendered badge text in column index 1 (URL Count td) -->
              <script type="text/javascript">
                <![CDATA[
                document.addEventListener('DOMContentLoaded', function() {
                  var total = 0;
                  // Column index 1 = URL Count badge cell (0=Path, 1=Count, 2=Date)
                  var cells = document.querySelectorAll('#sitemapTable tbody tr td:nth-child(2)');
                  cells.forEach(function(td) {
                    var text = td.textContent.trim().replace(/[^0-9]/g, '');
                    var v = parseInt(text, 10);
                    if (!isNaN(v) && v > 0) total += v;
                  });
                  var el = document.getElementById('totalUrlCount');
                  if (el) el.textContent = total > 0 ? total.toLocaleString() : '0';
                });
                ]]>
              </script>
            </xsl:when>

            <!-- ══════════════════════════════════════════════
                 URLSET VIEW
                 image:image fully supported here by Google
                 ══════════════════════════════════════════════ -->
            <xsl:otherwise>
              <xsl:variable name="hasImages" select="boolean(sitemap:urlset/sitemap:url/image:image)"/>
              <div class="stats-container">
                <div class="stat-tile">
                  <div class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                  <div class="stat-label">Verified URLs</div>
                </div>
                <xsl:if test="sitemap:urlset/sitemap:url/sitemap:priority">
                  <div class="stat-tile">
                    <div class="stat-number">
                      <xsl:variable name="avg" select="sum(sitemap:urlset/sitemap:url/sitemap:priority) div count(sitemap:urlset/sitemap:url)"/>
                      <xsl:value-of select="format-number($avg, '0.00')"/>
                    </div>
                    <div class="stat-label">Avg Priority</div>
                  </div>
                </xsl:if>
              </div>

              <div class="main-content">
                <div class="content-header">
                  <div class="search-wrapper">
                    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input id="searchInput" type="text" placeholder="Filter URLs…" oninput="filterTable()"/>
                  </div>
                </div>
                <div class="table-scroll">
                  <table id="sitemapTable">
                    <thead>
                      <tr>
                        <xsl:if test="$hasImages"><th>Image</th></xsl:if>
                        <th>
                          <xsl:attribute name="onclick">
                            <xsl:choose>
                              <xsl:when test="$hasImages">sortTable(1)</xsl:when>
                              <xsl:otherwise>sortTable(0)</xsl:otherwise>
                            </xsl:choose>
                          </xsl:attribute>
                          Resource URL
                        </th>
                        <th>
                          <xsl:attribute name="onclick">
                            <xsl:choose>
                              <xsl:when test="$hasImages">sortTable(2)</xsl:when>
                              <xsl:otherwise>sortTable(1)</xsl:otherwise>
                            </xsl:choose>
                          </xsl:attribute>
                          Last Modified
                        </th>
                        <th>
                          <xsl:attribute name="onclick">
                            <xsl:choose>
                              <xsl:when test="$hasImages">sortTable(3)</xsl:when>
                              <xsl:otherwise>sortTable(2)</xsl:otherwise>
                            </xsl:choose>
                          </xsl:attribute>
                          Frequency
                        </th>
                        <th>
                          <xsl:attribute name="onclick">
                            <xsl:choose>
                              <xsl:when test="$hasImages">sortTable(4)</xsl:when>
                              <xsl:otherwise>sortTable(3)</xsl:otherwise>
                            </xsl:choose>
                          </xsl:attribute>
                          Priority
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <xsl:for-each select="sitemap:urlset/sitemap:url">
                        <tr>
                          <xsl:if test="$hasImages">
                            <td>
                              <xsl:if test="image:image/image:loc">
                                <div class="img-wrap">
                                  <img src="{image:image/image:loc}" loading="lazy" alt="" onerror="this.parentNode.style.display='none'"/>
                                </div>
                              </xsl:if>
                            </td>
                          </xsl:if>
                          <td>
                            <div class="url-cell">
                              <a class="url-text" href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                              <button class="copy-btn" onclick="copyToClipboard('{sitemap:loc}', this)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                              </button>
                            </div>
                          </td>
                          <td style="color:var(--text-dim)">
                            <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                          </td>
                          <td><span class="badge badge-freq"><xsl:value-of select="sitemap:changefreq"/></span></td>
                          <td><span class="badge badge-prio"><xsl:value-of select="sitemap:priority"/></span></td>
                        </tr>
                      </xsl:for-each>
                    </tbody>
                  </table>
                </div>
              </div>
            </xsl:otherwise>
          </xsl:choose>

          <footer>
            <p>&#169; 2026 AddressGuru.ae | XML Sitemap Infrastructure</p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

  res.setHeader("Content-Type", "application/xslt+xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.write(xsl);
  res.end();

  return { props: {} };
}
