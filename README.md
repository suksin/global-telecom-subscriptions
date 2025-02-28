**Create table**
`aws dynamodb create-table --table-name GlobalTelecomSubscriptions \          
  --attribute-definitions AttributeName=eventId,AttributeType=S \      
  --key-schema AttributeName=eventId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1`

-----------------------------------------------

**Create replica**
`aws dynamodb update-table --table-name GlobalTelecomSubscriptions \          
  --replica-updates "[{\"Create\": {\"RegionName\": \"us-west-2\"}}]" \
  --region us-east-1`