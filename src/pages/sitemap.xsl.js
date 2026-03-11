// pages/sitemap.xsl.js
export default function SitemapXSL() {
  return null;
}

export async function getServerSideProps({ res }) {
  const xsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/1999/xhtml"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            color: #333;
            background-color: #1a2332;
            margin: 0;
            padding: 0;
          }
          
          .header {
            background-color: #1a2332;
            color: #fff;
            padding: 30px;
            border-bottom: 1px solid #2d3748;
          }
          
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          
          .header p {
            margin: 10px 0 0 0;
            color: #a0aec0;
            font-size: 14px;
          }
          
          .header a {
            color: #63b3ed;
            text-decoration: none;
          }
          
          .header a:hover {
            text-decoration: underline;
          }
          
          .content {
            padding: 30px;
            background-color: #fff;
            min-height: calc(100vh - 200px);
          }
          
          .url-count {
            font-size: 16px;
            color: #2d3748;
            margin: 0 0 20px 0;
            font-weight: 600;
          }
          
          .filter-container {
            margin-bottom: 20px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
          }
          
          .filter-input {
            padding: 10px 15px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
            flex: 1;
            min-width: 250px;
          }
          
          .filter-input:focus {
            outline: none;
            border-color: #3182ce;
          }
          
          .filter-select {
            padding: 10px 15px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
            background-color: white;
            cursor: pointer;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          th {
            background-color: #2d3748;
            color: #fff;
            font-weight: 600;
            padding: 15px;
            text-align: left;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            user-select: none;
          }
          
          th:hover {
            background-color: #1a202c;
          }
          
          th.sortable::after {
            content: ' ⇅';
            opacity: 0.5;
            font-size: 12px;
          }
          
          td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }
          
          tr:hover {
            background-color: #f7fafc;
          }
          
          .url-cell {
            max-width: 500px;
            word-break: break-all;
          }
          
          .url-cell a {
            color: #3182ce;
            text-decoration: none;
          }
          
          .url-cell a:hover {
            text-decoration: underline;
            color: #2c5282;
          }
          
          .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            white-space: nowrap;
          }
          
          .badge-count {
            background-color: #e3f2fd;
            color: #1976d2;
          }
          
          .badge-priority {
            background-color: #fff3e0;
            color: #f57c00;
          }
          
          .badge-priority-high {
            background-color: #ffebee;
            color: #c62828;
          }
          
          .badge-priority-low {
            background-color: #f1f8e9;
            color: #558b2f;
          }
          
          .badge-frequency {
            background-color: #f3e5f5;
            color: #7b1fa2;
            text-transform: capitalize;
          }
          
          .badge-daily {
            background-color: #e8f5e9;
            color: #2e7d32;
          }
          
          .badge-weekly {
            background-color: #e3f2fd;
            color: #1565c0;
          }
          
          .badge-monthly {
            background-color: #fff3e0;
            color: #ef6c00;
          }
          
          .date-cell {
            color: #718096;
            font-size: 13px;
            white-space: nowrap;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
          }
          
          .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .stat-number {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
          }
          
          .stat-label {
            font-size: 13px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .no-results {
            text-align: center;
            padding: 60px 20px;
            color: #718096;
          }
          
          @media (max-width: 768px) {
            .content {
              padding: 15px;
            }
            
            .filter-container {
              flex-direction: column;
            }
            
            .filter-input,
            .filter-select {
              min-width: 100%;
            }
            
            table {
              font-size: 12px;
            }
            
            th, td {
              padding: 10px 8px;
            }
            
            .stats-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
        <script type="text/javascript">
          <![CDATA[
          function filterTable() {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            const freqFilter = document.getElementById('freqFilter').value;
            const priorityFilter = document.getElementById('priorityFilter').value;
            const rows = document.querySelectorAll('tbody tr');
            let visibleCount = 0;
            
            rows.forEach(row => {
              const url = row.cells[0].textContent.toLowerCase();
              const freq = row.getAttribute('data-freq') || '';
              const priority = row.getAttribute('data-priority') || '';
              
              const matchSearch = url.includes(searchInput);
              const matchFreq = !freqFilter || freq === freqFilter;
              const matchPriority = !priorityFilter || priority === priorityFilter;
              
              if (matchSearch && matchFreq && matchPriority) {
                row.style.display = '';
                visibleCount++;
              } else {
                row.style.display = 'none';
              }
            });
            
            document.getElementById('visibleCount').textContent = visibleCount;
          }
          
          function sortTable(columnIndex) {
            const table = document.querySelector('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const isNumeric = columnIndex === 1 || columnIndex === 4; // URL Count or Priority
            
            rows.sort((a, b) => {
              let aVal = a.cells[columnIndex].textContent.trim();
              let bVal = b.cells[columnIndex].textContent.trim();
              
              if (isNumeric) {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
                return bVal - aVal; // Descending
              }
              
              return aVal.localeCompare(bVal);
            });
            
            rows.forEach(row => tbody.appendChild(row));
          }
          ]]>
        </script>
      </head>
      <body>
        <div class="header">
          <h1>XML Sitemap</h1>
          <p>Generated by <a href="https://www.addressguru.sg">AddressGuru</a>, this is an XML Sitemap, meant to be consumed by search engines like Google or Bing.</p>
          <p>You can find more information about XML Sitemaps at <a href="https://www.sitemaps.org">sitemaps.org</a></p>
        </div>
        
        <div class="content">
          <xsl:choose>
            <!-- Sitemap Index -->
            <xsl:when test="sitemap:sitemapindex">
              <p class="url-count">
                <strong>Sitemap Index</strong>
              </p>
              <table>
                <thead>
                  <tr>
                    <th style="width: 60%;">Sitemaps URL</th>
                    <th style="width: 20%;">URL Count</th>
                    <th style="width: 20%;">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <tr>
                      <td>
                        <a href="{sitemap:loc}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                      <td>
                        <xsl:choose>
                          <xsl:when test="sitemap:urlCount">
                            <xsl:value-of select="sitemap:urlCount"/>
                          </xsl:when>
                          <xsl:when test="urlCount">
                            <xsl:value-of select="urlCount"/>
                          </xsl:when>
                          <xsl:otherwise>-</xsl:otherwise>
                        </xsl:choose>
                      </td>
                      <td>
                        <xsl:value-of select="sitemap:lastmod"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>
            
            <!-- URL Set with Enhanced Fields -->
            <xsl:otherwise>
              <!-- Statistics Cards -->
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-number" id="visibleCount">
                    <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
                  </div>
                  <div class="stat-label">Total URLs</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">
                    <xsl:value-of select="sum(sitemap:urlset/sitemap:url/urlCount)"/>
                  </div>
                  <div class="stat-label">Total URL Count</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">
                    <xsl:value-of select="format-number(sum(sitemap:urlset/sitemap:url/priority) div count(sitemap:urlset/sitemap:url), '#.##')"/>
                  </div>
                  <div class="stat-label">Avg Priority</div>
                </div>
              </div>
              
              <!-- Filters -->
              <div class="filter-container">
                <input 
                  type="text" 
                  id="searchInput" 
                  class="filter-input" 
                  placeholder="Search URLs..." 
                  onkeyup="filterTable()"
                />
                <select id="freqFilter" class="filter-select" onchange="filterTable()">
                  <option value="">All Frequencies</option>
                  <option value="always">Always</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="never">Never</option>
                </select>
                <select id="priorityFilter" class="filter-select" onchange="filterTable()">
                  <option value="">All Priorities</option>
                  <option value="1.0">1.0 (Highest)</option>
                  <option value="0.9">0.9</option>
                  <option value="0.8">0.8</option>
                  <option value="0.7">0.7</option>
                  <option value="0.6">0.6</option>
                  <option value="0.5">0.5</option>
                </select>
              </div>
              
              <!-- Table -->
              <table>
                <thead>
                  <tr>
                    <th class="sortable" onclick="sortTable(0)" style="width: 40%;">URL</th>
                    <th class="sortable" onclick="sortTable(1)" style="width: 12%;">URL Count</th>
                    <th class="sortable" onclick="sortTable(2)" style="width: 18%;">Last Modified</th>
                    <th class="sortable" onclick="sortTable(3)" style="width: 15%;">Change Frequency</th>
                    <th class="sortable" onclick="sortTable(4)" style="width: 15%;">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <xsl:attribute name="data-freq">
                        <xsl:value-of select="changefreq"/>
                      </xsl:attribute>
                      <xsl:attribute name="data-priority">
                        <xsl:value-of select="priority"/>
                      </xsl:attribute>
                      
                      <!-- URL -->
                      <td class="url-cell">
                        <a href="{sitemap:loc}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                      
                      <!-- URL Count -->
                      <td>
                        <xsl:choose>
                          <xsl:when test="urlCount">
                            <span class="badge badge-count">
                              <xsl:value-of select="urlCount"/>
                            </span>
                          </xsl:when>
                          <xsl:otherwise>-</xsl:otherwise>
                        </xsl:choose>
                      </td>
                      
                      <!-- Last Modified -->
                      <td class="date-cell">
                        <xsl:value-of select="sitemap:lastmod"/>
                      </td>
                      
                      <!-- Change Frequency -->
                      <td>
                        <xsl:choose>
                          <xsl:when test="changefreq">
                            <xsl:choose>
                              <xsl:when test="changefreq = 'daily'">
                                <span class="badge badge-daily">
                                  <xsl:value-of select="changefreq"/>
                                </span>
                              </xsl:when>
                              <xsl:when test="changefreq = 'weekly'">
                                <span class="badge badge-weekly">
                                  <xsl:value-of select="changefreq"/>
                                </span>
                              </xsl:when>
                              <xsl:when test="changefreq = 'monthly'">
                                <span class="badge badge-monthly">
                                  <xsl:value-of select="changefreq"/>
                                </span>
                              </xsl:when>
                              <xsl:otherwise>
                                <span class="badge badge-frequency">
                                  <xsl:value-of select="changefreq"/>
                                </span>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:when>
                          <xsl:otherwise>-</xsl:otherwise>
                        </xsl:choose>
                      </td>
                      
                      <!-- Priority -->
                      <td>
                        <xsl:choose>
                          <xsl:when test="priority">
                            <xsl:choose>
                              <xsl:when test="number(priority) &gt;= 0.8">
                                <span class="badge badge-priority-high">
                                  <xsl:value-of select="priority"/>
                                </span>
                              </xsl:when>
                              <xsl:when test="number(priority) &lt; 0.5">
                                <span class="badge badge-priority-low">
                                  <xsl:value-of select="priority"/>
                                </span>
                              </xsl:when>
                              <xsl:otherwise>
                                <span class="badge badge-priority">
                                  <xsl:value-of select="priority"/>
                                </span>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:when>
                          <xsl:otherwise>-</xsl:otherwise>
                        </xsl:choose>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

  res.setHeader("Content-Type", "application/xslt+xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.write(xsl);
  res.end();

  return {
    props: {},
  };
}
