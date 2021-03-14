import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as SendGrid from "@sendgrid/mail";
import * as querystring from "querystring";
SendGrid.setApiKey(process.env["SendGridApiKey"] as string);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log("HTTP trigger function processed a request.");

    // form data submitted as query string in request body
    const body = querystring.parse(req.body);

    // check to make sure form was submitted with field data entered
    if (body && body.emailMessage) {
      // create an email options object
      const email = {
        to: process.env["SendGridReceiver"],
        from: process.env["SendGridSender"],
        subject: "Plattformradar: Neuer Kontakt",
        html: `<div>Name: ${body.emailMessage}</div>`,
      };
  
      try {
        await SendGrid.send(email);
  
        context.res.status = 200;
        context.res.body = {
          message: "Email successful! Check email for the message.",
        };
      } catch (error) {
        context.res.status = 400;
        context.res.body = {
          message: "An error occurred.",
        };
      }
    } else {
      context.res.status = 400;
      context.res.body = {
        message: `Form submission is invalid. Please try again. ${body}`,
      };
    }

};

export default httpTrigger;