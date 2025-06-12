import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchKamitsubakiEvents() {
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Fetching events from KAMITSUBAKI official site... (attempt ${attempt}/${maxRetries})`);
            
            // Fetch the events page with better error handling and timeout
            const response = await fetch('https://kamitsubaki.jp/event/', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                },
                timeout: 15000, // 15 second timeout
                agent: false, // Disable connection pooling for firewall compatibility
                follow: 5, // Allow up to 5 redirects
                compress: true // Handle gzip compression
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            console.log(`Successfully fetched HTML content (${html.length} characters)`);
            
            const $ = cheerio.load(html);
            const events = [];
            
            // Use the correct selector for KAMITSUBAKI event structure
            const eventElements = $('article.event--lineup__block');
            console.log(`Found ${eventElements.length} event elements`);
            
            eventElements.each((index, element) => {
                const $event = $(element);
                
                // Extract event information using the correct selectors for KAMITSUBAKI site
                const title = $event.find('h3').first().text().trim();
                const dateElement = $event.find('.date, .time').first();
                const dateText = dateElement.length > 0 ? dateElement.text().trim() : $event.text().match(/\d{4}年\d{1,2}月\d{1,2}日/)?.[0] || '';
                const venue = $event.find('.place').first().text().trim();
                const performers = $event.find('h2').first().text().trim(); // Artist name is in h2
            
            // Extract URL - look for links within the event element
            let eventUrl = '';
            
            // Try multiple selectors to find links
            const linkSelectors = ['a[href]', '.event-link a', '.read-more a', '.detail-link a', '.event-title a'];
            for (const selector of linkSelectors) {
                const linkElement = $event.find(selector).first();
                if (linkElement.length > 0) {
                    const href = linkElement.attr('href');
                    if (href && !href.includes('#') && href !== '/') {
                        // Convert relative URLs to absolute URLs
                        eventUrl = href.startsWith('http') ? href : `https://kamitsubaki.jp${href.startsWith('/') ? '' : '/'}${href}`;
                        break;
                    }
                }
            }
            
            // If no URL found, try to generate a more specific URL based on event content
            if (!eventUrl && title) {
                // Generate URL based on event title and content
                const urlSlug = title.toLowerCase()
                    .replace(/[^a-zA-Z0-9\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '') // Remove special chars except Japanese
                    .replace(/\s+/g, '-')
                    .replace(/神椿市建設中/g, 'mr-content')
                    .replace(/体験会/g, 'experience')
                    .replace(/ライブ/g, 'live')
                    .replace(/ファンミ/g, 'fanmeeting')
                    .replace(/配信/g, 'stream')
                    .replace(/トーク/g, 'talk')
                    .slice(0, 50); // Limit length
                
                if (urlSlug.length > 0) {
                    eventUrl = `https://kamitsubaki.jp/event/${urlSlug}/`;
                }
            }
            
            // Fallback to the main event page if no specific URL found
            if (!eventUrl) {
                eventUrl = 'https://kamitsubaki.jp/event/';
            }
            
                if (title && title.length > 0) {
                    // Parse date - handle Japanese date format (年月日)
                    let eventDate = '2025-12-01';
                    let eventTime = '19:00';
                    
                    // Look for date patterns in both dateText and full element text
                    const fullText = $event.text();
                    
                    // Try Japanese date format first (2025年8月30日)
                    const japDateMatch = fullText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
                    if (japDateMatch) {
                        const [, year, month, day] = japDateMatch;
                        eventDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    } else if (dateText) {
                        // Fallback to standard date format
                        const dateMatch = dateText.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
                        if (dateMatch) {
                            eventDate = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`;
                        }
                    }
                    
                    // Try to extract time
                    const timeMatch = fullText.match(/(\d{1,2}):(\d{2})/);
                    if (timeMatch) {
                        eventTime = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
                    }
                    
                    // Determine event category based on title
                    let category = 'live';
                    if (title.includes('体験') || title.includes('MR')) category = 'experience';
                    else if (title.includes('ファンミ') || title.includes('meeting')) category = 'fanmeeting';
                    else if (title.includes('配信') || title.includes('LIVE')) category = 'live';
                    else if (title.includes('トーク')) category = 'talk';
                    
                    events.push({
                        id: `event-${Date.now()}-${index}`,
                        title: title,
                        date: eventDate,
                        time: eventTime,
                        endTime: eventTime, // Default to same time, could be enhanced
                        venue: venue || 'TBD',
                        address: '', // Could be extracted from venue if needed
                        performers: performers || '',
                        category: category,
                        ticketInfo: 'チケット情報は公式サイトをご確認ください',
                        description: '', // Could be extracted from content
                        tags: [], // Could be auto-generated based on title/performers
                        status: '',
                        url: eventUrl,
                        image: null, // Will be populated if available
                        access: null // Will be populated with venue details if available
                    });
                    
                    console.log(`Extracted event ${index + 1}: ${title} at ${venue} on ${eventDate}`);
                }
            });
            
            // If events were found, return them
            if (events.length > 0) {
                console.log(`Successfully extracted ${events.length} events`);
                return events;
            }
            
            // If no events found but network was successful, log warning and use fallback
            console.log('No events found from website, using fallback data...');
            return getFallbackEvents();
            
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            
            // If this was the last attempt, return fallback data
            if (attempt === maxRetries) {
                console.error('All retry attempts failed, using fallback data...');
                return getFallbackEvents();
            }
            
            // Wait before retrying
            console.log(`Waiting ${retryDelay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}

function getFallbackEvents() {
    return [
                {
                    id: 'fallback-1',
                    title: "神椿市建設中。MRコンテンツ体験会（東京会場）",
                    date: "2025-12-01",
                    time: "14:00",
                    endTime: "18:00",
                    venue: "Tokyo XR World",
                    address: "東京都渋谷区",
                    performers: "KAMITSUBAKI STUDIO",
                    category: "experience",
                    ticketInfo: "事前予約制",
                    description: "最新のMR技術を使った神椿市の世界観を体験できます",
                    tags: ["MR", "体験会"],
                    status: "",
                    url: "https://kamitsubaki.jp/event/"
                },
                {
                    id: 'fallback-2',
                    title: "花譜 solo live 2025",
                    date: "2025-12-15",
                    time: "19:00",
                    endTime: "21:00",
                    venue: "Zepp Tokyo",
                    address: "東京都江東区青海1-3-11",
                    performers: "花譜",
                    category: "live",
                    ticketInfo: "全席指定 ¥8,000",
                    description: "花譜の待望のソロライブ",
                    tags: ["花譜", "ソロライブ"],
                    status: "",
                    url: "https://kamitsubaki.jp/event/"
                }
            ];
}

async function main() {
    try {
        const events = await fetchKamitsubakiEvents();
        
        // Create data directory if it doesn't exist
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Save events to JSON file
        const eventsData = {
            lastUpdated: new Date().toISOString(),
            events: events
        };
        
        const filePath = path.join(dataDir, 'events.json');
        fs.writeFileSync(filePath, JSON.stringify(eventsData, null, 2), 'utf8');
        
        console.log(`Events data saved to ${filePath}`);
        console.log(`Total events: ${events.length}`);
        
    } catch (error) {
        console.error('Failed to update events:', error);
        process.exit(1);
    }
}

// Only run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { fetchKamitsubakiEvents };