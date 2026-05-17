import React, { useEffect, useRef } from 'react'; 
import * as powerbi from 'powerbi-client'; 
 
const PowerBIEmbed = ({ embedUrl, accessToken, reportId }) => { 
  const reportRef = useRef(null); 
 
  useEffect(() => { 
    const embedConfig = { 
      type: 'report', 
      id: reportId, 
      embedUrl: embedUrl, 
      accessToken: accessToken,
      tokenType: powerbi.models.TokenType.Embed, 
      settings: { 
        filterPaneEnabled: false, 
        navContentPaneEnabled: false 
      } 
    }; 
 
    const reportContainer = reportRef.current; 
    const powerbiReport = powerbi.embed(reportContainer, embedConfig); 
 
    return () => { 
      powerbiReport?.destroy(); 
    }; 
  }, [embedUrl, accessToken, reportId]); 
 
  return <div ref={reportRef} style={{ height: '80vh', width: '100%' }} />; 
}; 
 
export default PowerBIEmbed;