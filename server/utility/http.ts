import * as request from "request";
const RESPONSE = 'response';
const DATA = 'data';
const END = 'end';

export class Http {
  public get(uri: string, options?: any): Promise<any> {
    let resolve: (result: any) => void;
    let reject: (error: any) => void;

    let body = '';
    request.get(uri, options)
      .on(RESPONSE, (response) => {
        if (response.statusCode !== 200) {
          reject(response);
        }
      })
      .on(DATA, (data) => {
        body += data;
      })
      .on(END, () => {
        resolve(JSON.parse(body));
      });

    return new Promise((r1, r2) => {
      resolve = r1;
      reject = r2;
    });
  }

  public put(uri: string, options?: any): Promise<any> {
    let resolve: (result: any) => void;
    let reject: (error: any) => void;

    let b = '';
    request.put(uri, options)
      .on(RESPONSE, (response) => {
        if (response.statusCode >= 300) {
          reject(response);
        }
      })
      .on(DATA, (data) => {
        b += data;
      })
      .on(END, () => {
        if(b) {
          resolve(JSON.parse(b));
        }{
          resolve(null);
        }
      });

    return new Promise((r1, r2) => {
      resolve = r1;
      reject = r2;
    });
  }
}
