import {GraphQLClient} from "graphql-request";
import { baseUrl } from "../constants/baseUrl";



export const client = new GraphQLClient(baseUrl)