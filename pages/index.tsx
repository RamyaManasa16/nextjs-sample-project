// import { useEffect, useState } from "react";

// interface Continent {
//     name: string;
// }

// interface Country {
//     code: string;
//     name: string;
//     continent: Continent;
// }

// interface ApiResponse {
//     countries: Country[];
// }

// export default function Home() {

//     const [countries, setCountries] = useState<Country[]>([]);
//     const [error, setError] = useState<Error | null>(null);

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const response = await fetch("/api/countries");
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data: ApiResponse = await response.json();
//                 setCountries(data.countries);
//             }
//             catch (error) {
//                 if (error instanceof Error) {
//                     setError(error);
//                 }
//                 else {
//                     setError(new Error('An unknown error occurred'));
//                 }

//             }
//         }
//         fetchData();
//     }, []);
//     if (error) {
//         return <div>Error: {error.message}</div>
//     }

//     return (
//         <div className="div">
//             <h1>Countries</h1>
//             <ul>
//                 {countries.map((result) => (
//                     <li key={result.code}>
//                         {result.name} - {result.continent.name}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     )
// }

import { GetServerSideProps, NextPage } from 'next';
import { GraphQLClient } from 'graphql-request';
import "../app/globals.css";

// Define the GraphQL query to get country data
const COUNTRY_QUERY = `
  query {
    countries {
      code
      name
      continent {
        name
      }
      emoji
      languages {
        name
      }
    }
  }
`;

// Define TypeScript types for the country data
interface Continent {
  name: string;
}

interface Language {
  name: string;
}

interface Country {
  code: string;
  name: string;
  continent: Continent;
  emoji: string;
  languages: Language[];
}

interface CountriesPageProps {
  countries: Country[];
}

// The Next.js page component
const CountriesPage: NextPage<CountriesPageProps> = ({ countries }) => {
  return (
    <div className="container">
      <h1 className="title">Countries Information</h1>
      <div className="grid">
        {countries.map((country) => (
          <div className="card" key={country.code}>
            <div className="flag">{country.emoji}</div>
            <h3>{country.name}</h3>
            <p>
              <strong>Code:</strong> {country.code}
            </p>
            <p>
              <strong>Continent:</strong> {country.continent.name}
            </p>
            <p>
              <strong>Languages:</strong> {country.languages.map(lang => lang.name).join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fetch data from the GraphQL API using getServerSideProps
export const getServerSideProps: GetServerSideProps = async () => {
  const endpoint = 'https://countries.trevorblades.com/';
  const client = new GraphQLClient(endpoint);

  try {
    const data: any = await client.request(COUNTRY_QUERY);

    return {
      props: {
        countries: data.countries,
      },
    };
  } catch (error) {
    console.error('Error fetching data from GraphQL API:', error);
    return {
      props: {
        countries: [],
      },
    };
  }
};

export default CountriesPage;
