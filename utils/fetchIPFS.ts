/**
 * Fetches a file from Pinata IPFS gateway
 * @param {string} cid - The IPFS Content Identifier
 * @param {string} gatewayToken - The Pinata Gateway Token
 * @param {string} gatewayUrl - The Pinata Gateway URL subdomain
 * @returns {Promise<Blob>} - A promise that resolves to the file as a Blob
 */
async function fetchIPFSFile(
    cid: string, 
    gatewayToken: string, 
    gatewayUrl: string = 'yellow-bitter-spoonbill-240.mypinata.cloud'
  ): Promise<Blob> {
    try {
      const url = `https://${gatewayUrl}/ipfs/${cid}?pinataGatewayToken=${gatewayToken}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': '*/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Return the response as a blob
      return await response.blob();
    } catch (error) {
      console.error('Error fetching IPFS file:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
  
  // Example usage
   export  async function downloadAndUseFile(): Promise<void> {
    const cid = 'bafkreihyppc4gvnxpihm5m3rhiiy4ygw27ecjhq3a5hrdhcs4elobladme';
    const gatewayToken = 'yuGGaXesmUeW1aLoE4XiyO5qYzELRcouxHgzZKnoY2xf_Xm2S4UvbXynpbY0hA0p';
    
    try {
      const fileBlob = await fetchIPFSFile(cid, gatewayToken);
      
      // Create object URL to use in browser
      const objectUrl = URL.createObjectURL(fileBlob);
      
      // Example: Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = objectUrl;
      downloadLink.download = 'downloaded_file'; // Set desired filename
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Remember to revoke the object URL when done to free memory
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Download failed:', error instanceof Error ? error.message : String(error));
    }
  }