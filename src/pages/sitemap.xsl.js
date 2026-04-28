// pages/sitemap.xsl.js
export default function SitemapXSL() {
  return null;
}

export async function getServerSideProps({ res }) {
  const xsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/1999/xhtml"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:adx="https://www.addressguru.ae/schemas/sitemap/1.0"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Sitemap Dashboard | AddressGuru</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
            --border: rgba(255, 255, 255, 0.08);
            --glass: rgba(255, 255, 255, 0.03);
            --success: #10b981;
            --info: #3b82f6;
          }

          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            padding: 40px 20px;
            background-image: 
              radial-gradient(circle at 10% 20%, rgba(251, 146, 60, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(244, 63, 94, 0.05) 0%, transparent 40%);
            min-height: 100vh;
          }

          .dashboard {
            max-width: 1280px;
            margin: 0 auto;
          }

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

          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .logo-box {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary), #f43f5e);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 20px;
            color: white;
            box-shadow: 0 0 20px var(--primary-glow);
          }

          .brand-name h1 {
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.5px;
          }

          .brand-name p {
            font-size: 12px;
            color: var(--text-dim);
          }

          .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .stat-tile {
            background: var(--surface);
            border: 1px solid var(--border);
            padding: 24px;
            border-radius: 24px;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, border-color 0.3s ease;
          }
          
          .stat-tile:hover {
            transform: translateY(-5px);
            border-color: var(--primary);
          }

          .stat-tile::before {
            content: '';
            position: absolute;
            top: 0; right: 0;
            width: 80px; height: 80px;
            background: radial-gradient(circle at 100% 0%, var(--primary-glow), transparent 70%);
          }

          .stat-number {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 4px;
            color: var(--text-main);
          }

          .stat-label {
            color: var(--text-dim);
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .main-content {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }

          .content-header {
            padding: 24px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.02);
          }

          .search-wrapper {
            position: relative;
            width: 100%;
            max-width: 400px;
          }

          .search-wrapper input {
            width: 100%;
            background: var(--bg);
            border: 1px solid var(--border);
            padding: 12px 16px 12px 44px;
            border-radius: 14px;
            color: white;
            font-family: inherit;
            outline: none;
            transition: all 0.3s;
          }

          .search-wrapper input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 4px var(--primary-glow);
          }

          .search-wrapper svg {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-dim);
          }

          .table-scroll {
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            padding: 20px 24px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 1px;
            background: rgba(0, 0, 0, 0.2);
            cursor: pointer;
            white-space: nowrap;
          }

          th:hover { color: var(--primary); }

          td {
            padding: 18px 24px;
            border-bottom: 1px solid var(--border);
            vertical-align: middle;
          }

          tr:last-child td { border-bottom: none; }
          tr:hover td { background: var(--surface-hover); }

          .url-cell {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .url-text {
            color: var(--text-main);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
            word-break: break-all;
          }

          .url-text:hover { color: var(--primary); }

          .img-wrap {
            width: 54px;
            height: 54px;
            border-radius: 12px;
            overflow: hidden;
            background: var(--bg);
            border: 1px solid var(--border);
            flex-shrink: 0;
          }

          .img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .empty-icon {
            width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            font-size: 10px; color: var(--text-dim);
          }

          .badge {
            padding: 6px 12px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            display: inline-block;
          }

          .badge-count { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }
          .badge-freq { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
          .badge-prio { background: rgba(251, 146, 60, 0.1); color: #fbbf24; border: 1px solid rgba(251, 146, 60, 0.2); }

          .copy-btn {
            padding: 6px;
            background: transparent;
            border: none;
            color: var(--text-dim);
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s;
          }

          .copy-btn:hover { background: var(--bg); color: var(--primary); }

          @media (max-width: 768px) {
            .stats-container { grid-template-columns: 1fr; }
            .content-header { flex-direction: column; gap: 20px; }
            .search-wrapper { max-width: 100%; }
          }
        </style>
        <script type="text/javascript">
          <![CDATA[
          function sortTable(n) {
            var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
            table = document.getElementById("sitemapTable");
            switching = true;
            dir = "asc";
            while (switching) {
              switching = false;
              rows = table.rows;
              for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                var xVal = x.textContent.trim().toLowerCase();
                var yVal = y.textContent.trim().toLowerCase();
                var isNum = !isNaN(parseFloat(xVal.replace(/[^0-9.]/g, ''))) && !isNaN(parseFloat(yVal.replace(/[^0-9.]/g, '')));
                if (isNum) {
                  var xNum = parseFloat(xVal.replace(/[^0-9.]/g, '')) || 0;
                  var yNum = parseFloat(yVal.replace(/[^0-9.]/g, '')) || 0;
                  if (dir == "asc" ? xNum > yNum : xNum < yNum) { shouldSwitch = true; break; }
                } else {
                  if (dir == "asc" ? xVal > yVal : xVal < yVal) { shouldSwitch = true; break; }
                }
              }
              if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
              } else if (switchcount == 0 && dir == "asc") {
                dir = "desc"; switching = true;
              }
            }
          }

          function filterTable() {
            var input = document.getElementById("searchInput");
            var filter = input.value.toLowerCase();
            var table = document.getElementById("sitemapTable");
            var tr = table.getElementsByTagName("tr");
            for (var i = 1; i < tr.length; i++) {
              var found = false;
              var tds = tr[i].getElementsByTagName("td");
              for (var j = 0; j < tds.length; j++) {
                if (tds[j].textContent.toLowerCase().indexOf(filter) > -1) { found = true; break; }
              }
              tr[i].style.display = found ? "" : "none";
            }
          }

          async function copyToClipboard(text, btn) {
            try {
              await navigator.clipboard.writeText(text);
              const original = btn.innerHTML;
              btn.innerHTML = '✓';
              btn.style.color = '#10b981';
              setTimeout(() => { btn.innerHTML = original; btn.style.color = ''; }, 2000);
            } catch (err) {}
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
            <!-- INDEX VIEW -->
            <xsl:when test="sitemap:sitemapindex">
              <xsl:variable name="hasImages" select="boolean(sitemap:sitemapindex/sitemap:sitemap/adx:image)"/>
              <div class="stats-container">
                <div class="stat-tile">
                  <div class="stat-number"><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></div>
                  <div class="stat-label">Sitemaps Indexed</div>
                </div>
                <div class="stat-tile">
                  <div class="stat-number">
                    <xsl:choose>
                      <xsl:when test="sum(sitemap:sitemapindex/sitemap:sitemap/adx:urlCount) &gt; 0">
                        <xsl:value-of select="sum(sitemap:sitemapindex/sitemap:sitemap/adx:urlCount)"/>
                      </xsl:when>
                      <xsl:otherwise>-</xsl:otherwise>
                    </xsl:choose>
                  </div>
                  <div class="stat-label">Total Potential Links</div>
                </div>
              </div>

              <div class="main-content">
                <div class="table-scroll">
                  <table id="sitemapTable">
                    <thead>
                      <tr>
                        <xsl:if test="$hasImages"><th>Visual</th></xsl:if>
                        <th>
                          <xsl:attribute name="onclick">
                            <xsl:choose>
                              <xsl:when test="$hasImages">sortTable(1)</xsl:when>
                              <xsl:otherwise>sortTable(0)</xsl:otherwise>
                            </xsl:choose>
                          </xsl:attribute>
                          Sitemap Path
                        </th>
                        <th>
                          <xsl:attribute name="onclick">
                            <xsl:choose>
                              <xsl:when test="$hasImages">sortTable(2)</xsl:when>
                              <xsl:otherwise>sortTable(1)</xsl:otherwise>
                            </xsl:choose>
                          </xsl:attribute>
                          URL Count
                        </th>
                        <th>
                          <xsl:attribute name="onclick">
                            <xsl:choose>
                              <xsl:when test="$hasImages">sortTable(3)</xsl:when>
                              <xsl:otherwise>sortTable(2)</xsl:otherwise>
                            </xsl:choose>
                          </xsl:attribute>
                          Last Update
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                        <tr>
                          <xsl:if test="$hasImages">
                            <td>
                              <xsl:if test="adx:image">
                                <div class="img-wrap">
                                  <img src="{adx:image}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.display='none'"/>
                                </div>
                              </xsl:if>
                            </td>
                          </xsl:if>
                          <td>
                            <div class="url-cell">
                              <a class="url-text" href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                              <button class="copy-btn" onclick="copyToClipboard('{sitemap:loc}', this)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              </button>
                            </div>
                          </td>
                          <td>
                            <span class="badge badge-count">
                              <xsl:choose>
                                <xsl:when test="adx:urlCount"><xsl:value-of select="adx:urlCount"/></xsl:when>
                                <xsl:otherwise>-</xsl:otherwise>
                              </xsl:choose>
                            </span>
                          </td>
                          <td style="color: var(--text-dim)">
                            <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                          </td>
                        </tr>
                      </xsl:for-each>
                    </tbody>
                  </table>
                </div>
              </div>
            </xsl:when>

            <!-- URLSET VIEW -->
            <xsl:otherwise>
              <xsl:variable name="hasImages" select="boolean(sitemap:urlset/sitemap:url//*[local-name()='loc' and parent::*[local-name()='image']])"/>
              <div class="stats-container">
                <div class="stat-tile">
                  <div class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                  <div class="stat-label">Verified URLs</div>
                </div>
                <div class="stat-tile">
                  <div class="stat-number">
                    <xsl:choose>
                      <xsl:when test="sum(sitemap:urlset/sitemap:url/adx:urlCount) &gt; 0">
                        <xsl:value-of select="sum(sitemap:urlset/sitemap:url/adx:urlCount)"/>
                      </xsl:when>
                      <xsl:otherwise><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></xsl:otherwise>
                    </xsl:choose>
                  </div>
                  <div class="stat-label">Total Item Count</div>
                </div>
                <xsl:if test="sitemap:urlset/sitemap:url/sitemap:priority">
                  <div class="stat-tile">
                    <div class="stat-number">
                      <xsl:variable name="avg" select="sum(sitemap:urlset/sitemap:url/sitemap:priority) div count(sitemap:urlset/sitemap:url)"/>
                      <xsl:value-of select="substring($avg, 1, 4)"/>
                    </div>
                    <div class="stat-label">Avg Priority</div>
                  </div>
                </xsl:if>
              </div>

              <div class="main-content">
                <div class="table-scroll">
                  <table id="sitemapTable">
                    <thead>
                      <tr>
                        <xsl:if test="$hasImages"><th>Visual</th></xsl:if>
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
                              <xsl:if test=".//*[local-name()='loc' and parent::*[local-name()='image']]">
                                <div class="img-wrap">
                                  <img src="{.//*[local-name()='loc' and parent::*[local-name()='image']]}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.display='none'"/>
                                </div>
                              </xsl:if>
                            </td>
                          </xsl:if>
                          <td>
                            <div class="url-cell">
                              <a class="url-text" href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                              <button class="copy-btn" onclick="copyToClipboard('{sitemap:loc}', this)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              </button>
                            </div>
                          </td>
                          <td style="color: var(--text-dim)">
                            <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                          </td>
                          <td>
                            <span class="badge badge-freq"><xsl:value-of select="sitemap:changefreq"/></span>
                          </td>
                          <td>
                            <span class="badge badge-prio"><xsl:value-of select="sitemap:priority"/></span>
                          </td>
                        </tr>
                      </xsl:for-each>
                    </tbody>
                  </table>
                </div>
              </div>
            </xsl:otherwise>
          </xsl:choose>
          
          <footer style="margin-top: 40px; text-align: center; color: var(--text-dim); font-size: 14px;">
            <p>© 2026 AddressGuru.ae | XML Sitemap Infrastructure</p>
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
