import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from "@apollo/client";

/**
 * Middleware operation
 * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink((operation, forward) => {
	/**
	 * If session data exist in local storage, set value as session header.
	 */
	const session = (typeof window !== 'undefined') ? localStorage.getItem("woo-session") : null;

	if (session) {
		operation.setContext(({ headers = {} }) => ({
			headers: {
				"woocommerce-session": `Session ${session}`,
				...headers
			}
		}));
	}

	return forward(operation);
});

/**
 * Afterware operation.
 *
 * This catches the incoming session token and stores it in localStorage, for future GraphQL requests.
 */
export const afterware = new ApolloLink((operation, forward) => {
	return forward(operation).map(response => {
		if (typeof window === 'undefined') {
			return response;
		}

		/**
		 * Check for session header and update session in local storage accordingly.
		 */
		const context = operation.getContext();
		const { response: { headers } } = context;
		const session = headers.get("woocommerce-session");

		if (session) {
			// Remove session data if session destroyed.
			if ("false" === session) {
				localStorage.removeItem("woo-session");
				// Update session new data if changed.
			} else if (localStorage.getItem("woo-session") !== session) {
				localStorage.setItem("woo-session", headers.get("woocommerce-session"));
			}
		}

		return response;
	});
});

// Apollo GraphQL client.
const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://glodery.com/graphql',
});

// Combine the links in the correct order
const link = ApolloLink.from([
	middleware,
	afterware,
	httpLink
]);

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
		},
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
	}
});

export default client;
