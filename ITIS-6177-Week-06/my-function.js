//This was created following the Azure Function getting started tutorial.
//See the directory SayZeke_AzureFunction for everything that was generated during that tutorial.
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const keyword = (req.query.keyword || (req.body && req.body.keyword));
    const responseMessage = keyword
        ? `Zeke Van Dehy says '${keyword}'`
        : "This HTTP triggered function executed successfully. Pass a keyword in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}