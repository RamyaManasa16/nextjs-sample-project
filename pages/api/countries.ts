import type { NextApiRequest, NextApiResponse } from "next";
import { request, gql } from "graphql-request";

const API_URL = "https://countries.trevorblades.com/";

const query = gql`
{
    countries {
        code
        name
        continent {
            name
        }
    }
}
`;

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const data = await request(API_URL, query);
        console.log('Data fetched', data);
        res.status(200).json(data);
    } catch(error) {
        console.log("Error fetching data:" , error);
        res.status(500).json({error: "Failed to fetch data"})
    }
}