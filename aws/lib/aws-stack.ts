import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

export class SurfBuddyStack extends cdk.Stack {
	resourcePrefix: string = "surfbuddy"
	prod: boolean

	constructor(scope: Construct, id: string, prod: boolean, props?: cdk.StackProps) {
		super(scope, id, props)
		this.prod = prod;

		// Trips Table
		const tripsTable = new dynamodb.Table(this, 'TripsTable', {
			tableName: `${this.resourcePrefix}-Trips-${this.prod ? 'prod' : 'dev'}`,
			partitionKey: { 
				name: 'pk', 
				type: dynamodb.AttributeType.STRING 
			},
			sortKey: { 
				name: 'sk', 
				type: dynamodb.AttributeType.STRING 
			},
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			pointInTimeRecovery: false,
			removalPolicy: this.prod ? cdk.RemovalPolicy.DESTROY : cdk.RemovalPolicy.DESTROY, // Change after launch
		});

		// GSI for location-based trip searches
		tripsTable.addGlobalSecondaryIndex({
			indexName: 'LocationSearchIndex',
			partitionKey: { 
				name: 'locationKey', 
				type: dynamodb.AttributeType.STRING 
			},
			sortKey: { 
				name: 'startDate', 
				type: dynamodb.AttributeType.STRING 
			},
		});

		// GSI for prefix-based location searches
		tripsTable.addGlobalSecondaryIndex({
			indexName: 'LocationPrefixIndex',
			partitionKey: { 
				name: 'entityType', 
				type: dynamodb.AttributeType.STRING 
			},
			sortKey: { 
				name: 'locationSortKey', 
				type: dynamodb.AttributeType.STRING 
			},
		});


		// Output table names for Vercel environment variables
		new cdk.CfnOutput(this, 'TripsTableName', {
			value: tripsTable.tableName,
			description: 'DynamoDB table name for trips data',
			exportName: `SurfBuddy-TripsTable-${this.prod ? 'Prod' : 'Dev'}`,
		});


		new cdk.CfnOutput(this, 'LocationIndexName', {
			value: 'LocationSearchIndex',
			description: 'GSI name for location-based searches',
			exportName: `SurfBuddy-LocationIndex-${this.prod ? 'Prod' : 'Dev'}`,
		});
	}
}
