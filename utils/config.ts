import { PinataSDK } from "pinata";

export const pinata = (pinataJwt: string, pinataGatewayUrl: string) => {
  return new PinataSDK({
    pinataJwt: pinataJwt,
    pinataGateway: pinataGatewayUrl,

  })
};
