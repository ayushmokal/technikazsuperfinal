import crypto from 'crypto';

interface PaapiConfig {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  host: string;
  region: string;
}

export class AmazonPaapiClient {
  private config: PaapiConfig;

  constructor(config: PaapiConfig) {
    this.config = config;
  }

  async searchItems(keywords: string, searchIndex = 'All') {
    try {
      const payload = {
        "Keywords": keywords,
        "Resources": [
          "Images.Primary.Medium",
          "ItemInfo.Title",
          "Offers.Listings.Price",
          "ItemInfo.Features",
          "ItemInfo.ProductInfo"
        ],
        "PartnerTag": this.config.partnerTag,
        "PartnerType": "Associates",
        "Marketplace": "www.amazon.in",
        "Operation": "SearchItems",
        "SearchIndex": searchIndex
      };

      const response = await this.makeRequest('SearchItems', payload);
      return response;
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search Amazon products. Please check your credentials and try again.');
    }
  }

  private async makeRequest(operation: string, payload: any) {
    const date = new Date();
    const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    const canonicalUri = '/paapi5/searchitems';
    const canonicalQueryString = '';
    const canonicalHeaders = {
      'content-encoding': 'amz-1.0',
      'content-type': 'application/json; charset=utf-8',
      'host': this.config.host,
      'x-amz-date': amzDate,
      'x-amz-target': `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`
    };

    const signedHeaders = Object.keys(canonicalHeaders)
      .sort()
      .join(';');

    const canonicalRequest = [
      'POST',
      canonicalUri,
      canonicalQueryString,
      Object.entries(canonicalHeaders)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join('\n'),
      '',
      signedHeaders,
      crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex')
    ].join('\n');

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${this.config.region}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    // Create signing key
    const kDate = crypto.createHmac('sha256', `AWS4${this.config.secretKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(this.config.region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update('ProductAdvertisingAPI').digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    const authorizationHeader = [
      `${algorithm} Credential=${this.config.accessKey}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`
    ].join(', ');

    const response = await fetch(`https://${this.config.host}${canonicalUri}`, {
      method: 'POST',
      headers: {
        ...canonicalHeaders,
        'Authorization': authorizationHeader
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Amazon PAAPI request failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    return response.json();
  }
}