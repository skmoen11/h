import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('leadTracker');
    const leadsCollection = db.collection('leads');
    
    if (req.method === 'POST') {
      // Handle postback from networks
      const { offer_id, offer_name, datetime, geo_country_name } = req.body;
      
      if (!offer_id || !datetime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const lead = {
        offerId: offer_id,
        offerName: offer_name || 'Unknown Offer',
        datetime: new Date(datetime),
        country: geo_country_name || 'Unknown',
        status: 'new',
        createdAt: new Date()
      };
      
      await leadsCollection.insertOne(lead);
      return res.status(200).json({ success: true });
      
    } else if (req.method === 'GET') {
      // Get leads for display
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      
      // Total approved leads (24 hours old)
      const totalLeads = await leadsCollection.countDocuments({
        createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        status: 'approved'
      });
      
      // Today's leads
      const todaysLeads = await leadsCollection.countDocuments({
        createdAt: { $gte: todayStart },
        status: { $in: ['new', 'approved'] }
      });
      
      // Recent leads (last 50)
      const recentLeads = await leadsCollection.find({
        status: { $in: ['new', 'approved'] }
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
      
      return res.status(200).json({
        totalLeads,
        todaysLeads,
        recentLeads: recentLeads.map(lead => ({
          offerId: lead.offerId,
          offerName: lead.offerName,
          datetime: lead.datetime,
          country: lead.country
        }))
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
  
  return res.status(405).end(); // Method not allowed
}s