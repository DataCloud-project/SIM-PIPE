declare namespace WorkflowsArgoprojIo {
    export type WorkflowsJson = /* ClusterWorkflowTemplate is the definition of a workflow template resource in cluster scope */ WorkflowsJson.Definitions.IoArgoprojWorkflowV1alpha1ClusterWorkflowTemplate | /* CronWorkflow is the definition of a scheduled workflow resource */ WorkflowsJson.Definitions.IoArgoprojWorkflowV1alpha1CronWorkflow | /* Workflow is the definition of a workflow resource */ WorkflowsJson.Definitions.IoArgoprojWorkflowV1alpha1Workflow | /* WorkflowEventBinding is the definition of an event resource */ WorkflowsJson.Definitions.IoArgoprojWorkflowV1alpha1WorkflowEventBinding | /* WorkflowTemplate is the definition of a workflow template resource */ WorkflowsJson.Definitions.IoArgoprojWorkflowV1alpha1WorkflowTemplate;
    namespace WorkflowsJson {
        namespace Definitions {
            export interface GoogleProtobufAny {
                type_url?: string;
                value?: string; // byte
            }
            /**
             * AMQPConsumeConfig holds the configuration to immediately starts delivering queued messages
             * +k8s:openapi-gen=true
             */
            export interface IoArgoprojEventsV1alpha1AMQPConsumeConfig {
                /**
                 * AutoAck when true, the server will acknowledge deliveries to this consumer prior to writing
                 * the delivery to the network
                 * +optional
                 */
                autoAck?: boolean;
                /**
                 * ConsumerTag is the identity of the consumer included in every delivery
                 * +optional
                 */
                consumerTag?: string;
                /**
                 * Exclusive when true, the server will ensure that this is the sole consumer from this queue
                 * +optional
                 */
                exclusive?: boolean;
                /**
                 * NoLocal flag is not supported by RabbitMQ
                 * +optional
                 */
                noLocal?: boolean;
                /**
                 * NowWait when true, do not wait for the server to confirm the request and immediately begin deliveries
                 * +optional
                 */
                noWait?: boolean;
            }
            /**
             * AMQPEventSource refers to an event-source for AMQP stream events
             */
            export interface IoArgoprojEventsV1alpha1AMQPEventSource {
                /**
                 * Auth hosts secret selectors for username and password
                 * +optional
                 */
                auth?: /* BasicAuth contains the reference to K8s secrets that holds the username and password */ IoArgoprojEventsV1alpha1BasicAuth;
                /**
                 * Backoff holds parameters applied to connection.
                 * +optional
                 */
                connectionBackoff?: /* Backoff for an operation */ IoArgoprojEventsV1alpha1Backoff;
                /**
                 * Consume holds the configuration to immediately starts delivering queued messages
                 * For more information, visit https://pkg.go.dev/github.com/rabbitmq/amqp091-go#Channel.Consume
                 * +optional
                 */
                consume?: /**
                 * AMQPConsumeConfig holds the configuration to immediately starts delivering queued messages
                 * +k8s:openapi-gen=true
                 */
                IoArgoprojEventsV1alpha1AMQPConsumeConfig;
                /**
                 * ExchangeDeclare holds the configuration for the exchange on the server
                 * For more information, visit https://pkg.go.dev/github.com/rabbitmq/amqp091-go#Channel.ExchangeDeclare
                 * +optional
                 */
                exchangeDeclare?: /**
                 * AMQPExchangeDeclareConfig holds the configuration for the exchange on the server
                 * +k8s:openapi-gen=true
                 */
                IoArgoprojEventsV1alpha1AMQPExchangeDeclareConfig;
                /**
                 * ExchangeName is the exchange name
                 * For more information, visit https://www.rabbitmq.com/tutorials/amqp-concepts.html
                 */
                exchangeName?: string;
                /**
                 * ExchangeType is rabbitmq exchange type
                 */
                exchangeType?: string;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * QueueBind holds the configuration that binds an exchange to a queue so that publishings to the
                 * exchange will be routed to the queue when the publishing routing key matches the binding routing key
                 * For more information, visit https://pkg.go.dev/github.com/rabbitmq/amqp091-go#Channel.QueueBind
                 * +optional
                 */
                queueBind?: /**
                 * AMQPQueueBindConfig holds the configuration that binds an exchange to a queue so that publishings to the
                 * exchange will be routed to the queue when the publishing routing key matches the binding routing key
                 * +k8s:openapi-gen=true
                 */
                IoArgoprojEventsV1alpha1AMQPQueueBindConfig;
                /**
                 * QueueDeclare holds the configuration of a queue to hold messages and deliver to consumers.
                 * Declaring creates a queue if it doesn't already exist, or ensures that an existing queue matches
                 * the same parameters
                 * For more information, visit https://pkg.go.dev/github.com/rabbitmq/amqp091-go#Channel.QueueDeclare
                 * +optional
                 */
                queueDeclare?: /**
                 * AMQPQueueDeclareConfig holds the configuration of a queue to hold messages and deliver to consumers.
                 * Declaring creates a queue if it doesn't already exist, or ensures that an existing queue matches
                 * the same parameters
                 * +k8s:openapi-gen=true
                 */
                IoArgoprojEventsV1alpha1AMQPQueueDeclareConfig;
                /**
                 * Routing key for bindings
                 */
                routingKey?: string;
                /**
                 * TLS configuration for the amqp client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * URL for rabbitmq service
                 */
                url?: string;
                /**
                 * URLSecret is secret reference for rabbitmq service URL
                 */
                urlSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * AMQPExchangeDeclareConfig holds the configuration for the exchange on the server
             * +k8s:openapi-gen=true
             */
            export interface IoArgoprojEventsV1alpha1AMQPExchangeDeclareConfig {
                /**
                 * AutoDelete removes the exchange when no bindings are active
                 * +optional
                 */
                autoDelete?: boolean;
                /**
                 * Durable keeps the exchange also after the server restarts
                 * +optional
                 */
                durable?: boolean;
                /**
                 * Internal when true does not accept publishings
                 * +optional
                 */
                internal?: boolean;
                /**
                 * NowWait when true does not wait for a confirmation from the server
                 * +optional
                 */
                noWait?: boolean;
            }
            /**
             * AMQPQueueBindConfig holds the configuration that binds an exchange to a queue so that publishings to the
             * exchange will be routed to the queue when the publishing routing key matches the binding routing key
             * +k8s:openapi-gen=true
             */
            export interface IoArgoprojEventsV1alpha1AMQPQueueBindConfig {
                /**
                 * NowWait false and the queue could not be bound, the channel will be closed with an error
                 * +optional
                 */
                noWait?: boolean;
            }
            /**
             * AMQPQueueDeclareConfig holds the configuration of a queue to hold messages and deliver to consumers.
             * Declaring creates a queue if it doesn't already exist, or ensures that an existing queue matches
             * the same parameters
             * +k8s:openapi-gen=true
             */
            export interface IoArgoprojEventsV1alpha1AMQPQueueDeclareConfig {
                /**
                 * Arguments of a queue (also known as "x-arguments") used for optional features and plugins
                 * +optional
                 */
                arguments?: string;
                /**
                 * AutoDelete removes the queue when no consumers are active
                 * +optional
                 */
                autoDelete?: boolean;
                /**
                 * Durable keeps the queue also after the server restarts
                 * +optional
                 */
                durable?: boolean;
                /**
                 * Exclusive sets the queues to be accessible only by the connection that declares them and will be
                 * deleted wgen the connection closes
                 * +optional
                 */
                exclusive?: boolean;
                /**
                 * Name of the queue. If empty the server auto-generates a unique name for this queue
                 * +optional
                 */
                name?: string;
                /**
                 * NowWait when true, the queue assumes to be declared on the server
                 * +optional
                 */
                noWait?: boolean;
            }
            /**
             * AWSLambdaTrigger refers to specification of the trigger to invoke an AWS Lambda function
             */
            export interface IoArgoprojEventsV1alpha1AWSLambdaTrigger {
                /**
                 * AccessKey refers K8s secret containing aws access key
                 * +optional
                 */
                accessKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * FunctionName refers to the name of the function to invoke.
                 */
                functionName?: string;
                /**
                 * Choose from the following options.
                 *
                 *    * RequestResponse (default) - Invoke the function synchronously. Keep
                 *    the connection open until the function returns a response or times out.
                 *    The API response includes the function response and additional data.
                 *
                 *    * Event - Invoke the function asynchronously. Send events that fail multiple
                 *    times to the function's dead-letter queue (if it's configured). The API
                 *    response only includes a status code.
                 *
                 *    * DryRun - Validate parameter values and verify that the user or role
                 *    has permission to invoke the function.
                 * +optional
                 */
                invocationType?: string;
                /**
                 * Parameters is the list of key-value extracted from event's payload that are applied to
                 * the trigger resource.
                 * +optional
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Payload is the list of key-value extracted from an event payload to construct the request payload.
                 */
                payload?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Region is AWS region
                 */
                region?: string;
                /**
                 * RoleARN is the Amazon Resource Name (ARN) of the role to assume.
                 * +optional
                 */
                roleARN?: string;
                /**
                 * SecretKey refers K8s secret containing aws secret key
                 * +optional
                 */
                secretKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * Amount represent a numeric amount.
             */
            export interface IoArgoprojEventsV1alpha1Amount {
                value?: string; // byte
            }
            /**
             * ArgoWorkflowTrigger is the trigger for the Argo Workflow
             */
            export interface IoArgoprojEventsV1alpha1ArgoWorkflowTrigger {
                /**
                 * Args is the list of arguments to pass to the argo CLI
                 */
                args?: string[];
                /**
                 * Operation refers to the type of operation performed on the argo workflow resource.
                 * Default value is Submit.
                 * +optional
                 */
                operation?: string;
                /**
                 * Parameters is the list of parameters to pass to resolved Argo Workflow object
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Source of the K8s resource file(s)
                 */
                source?: /* ArtifactLocation describes the source location for an external artifact */ IoArgoprojEventsV1alpha1ArtifactLocation;
            }
            /**
             * ArtifactLocation describes the source location for an external artifact
             */
            export interface IoArgoprojEventsV1alpha1ArtifactLocation {
                /**
                 * Configmap that stores the artifact
                 */
                configmap?: /* Selects a key from a ConfigMap. */ IoK8sApiCoreV1ConfigMapKeySelector;
                /**
                 * File artifact is artifact stored in a file
                 */
                file?: /* FileArtifact contains information about an artifact in a filesystem */ IoArgoprojEventsV1alpha1FileArtifact;
                /**
                 * Git repository hosting the artifact
                 */
                git?: /* GitArtifact contains information about an artifact stored in git */ IoArgoprojEventsV1alpha1GitArtifact;
                /**
                 * Inline artifact is embedded in sensor spec as a string
                 */
                inline?: string;
                /**
                 * Resource is generic template for K8s resource
                 */
                resource?: /* Resource represent arbitrary structured data. */ IoArgoprojEventsV1alpha1Resource;
                /**
                 * S3 compliant artifact
                 */
                s3?: /* S3Artifact contains information about an S3 connection and bucket */ IoArgoprojEventsV1alpha1S3Artifact;
                /**
                 * URL to fetch the artifact from
                 */
                url?: /* URLArtifact contains information about an artifact at an http endpoint. */ IoArgoprojEventsV1alpha1URLArtifact;
            }
            /**
             * AzureEventHubsTrigger refers to specification of the Azure Event Hubs Trigger
             */
            export interface IoArgoprojEventsV1alpha1AzureEventHubsTrigger {
                /**
                 * FQDN refers to the namespace dns of Azure Event Hubs to be used i.e. <namespace>.servicebus.windows.net
                 */
                fqdn?: string;
                /**
                 * HubName refers to the Azure Event Hub to send events to
                 */
                hubName?: string;
                /**
                 * Parameters is the list of key-value extracted from event's payload that are applied to
                 * the trigger resource.
                 * +optional
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Payload is the list of key-value extracted from an event payload to construct the request payload.
                 */
                payload?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * SharedAccessKey refers to a K8s secret containing the primary key for the
                 */
                sharedAccessKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * SharedAccessKeyName refers to the name of the Shared Access Key
                 */
                sharedAccessKeyName?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * AzureEventsHubEventSource describes the event source for azure events hub
             * More info at https://docs.microsoft.com/en-us/azure/event-hubs/
             */
            export interface IoArgoprojEventsV1alpha1AzureEventsHubEventSource {
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * FQDN of the EventHubs namespace you created
                 * More info at https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-get-connection-string
                 */
                fqdn?: string;
                /**
                 * Event Hub path/name
                 */
                hubName?: string;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * SharedAccessKey is the generated value of the key
                 */
                sharedAccessKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * SharedAccessKeyName is the name you chose for your application's SAS keys
                 */
                sharedAccessKeyName?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * Backoff for an operation
             */
            export interface IoArgoprojEventsV1alpha1Backoff {
                /**
                 * The initial duration in nanoseconds or strings like "1s", "3m"
                 * +optional
                 */
                duration?: IoArgoprojEventsV1alpha1Int64OrString;
                /**
                 * Duration is multiplied by factor each iteration
                 * +optional
                 */
                factor?: /* Amount represent a numeric amount. */ IoArgoprojEventsV1alpha1Amount;
                /**
                 * The amount of jitter applied each iteration
                 * +optional
                 */
                jitter?: /* Amount represent a numeric amount. */ IoArgoprojEventsV1alpha1Amount;
                /**
                 * Exit with error after this many steps
                 * +optional
                 */
                steps?: number;
            }
            /**
             * BasicAuth contains the reference to K8s secrets that holds the username and password
             */
            export interface IoArgoprojEventsV1alpha1BasicAuth {
                /**
                 * Password refers to the Kubernetes secret that holds the password required for basic auth.
                 */
                password?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Username refers to the Kubernetes secret that holds the username required for basic auth.
                 */
                username?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * BitbucketAuth holds the different auth strategies for connecting to Bitbucket
             */
            export interface IoArgoprojEventsV1alpha1BitbucketAuth {
                /**
                 * Basic is BasicAuth auth strategy.
                 * +optional
                 */
                basic?: /* BasicAuth holds the information required to authenticate user via basic auth mechanism */ IoArgoprojEventsV1alpha1BitbucketBasicAuth;
                /**
                 * OAuthToken refers to the K8s secret that holds the OAuth Bearer token.
                 * +optional
                 */
                oauthToken?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * BasicAuth holds the information required to authenticate user via basic auth mechanism
             */
            export interface IoArgoprojEventsV1alpha1BitbucketBasicAuth {
                /**
                 * Password refers to the K8s secret that holds the password.
                 */
                password?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Username refers to the K8s secret that holds the username.
                 */
                username?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * BitbucketEventSource describes the event source for Bitbucket
             */
            export interface IoArgoprojEventsV1alpha1BitbucketEventSource {
                /**
                 * Auth information required to connect to Bitbucket.
                 */
                auth?: /* BitbucketAuth holds the different auth strategies for connecting to Bitbucket */ IoArgoprojEventsV1alpha1BitbucketAuth;
                /**
                 * DeleteHookOnFinish determines whether to delete the defined Bitbucket hook once the event source is stopped.
                 * +optional
                 */
                deleteHookOnFinish?: boolean;
                /**
                 * Events this webhook is subscribed to.
                 */
                events?: string[];
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * Metadata holds the user defined metadata which will be passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * DeprecatedOwner is the owner of the repository.
                 * Deprecated: use Repositories instead. Will be unsupported in v1.9
                 * +optional
                 */
                owner?: string;
                /**
                 * DeprecatedProjectKey is the key of the project to which the repository relates
                 * Deprecated: use Repositories instead. Will be unsupported in v1.9
                 * +optional
                 */
                projectKey?: string;
                /**
                 * Repositories holds a list of repositories for which integration needs to set up
                 * +optional
                 */
                repositories?: IoArgoprojEventsV1alpha1BitbucketRepository[];
                /**
                 * DeprecatedRepositorySlug is a URL-friendly version of a repository name, automatically generated by Bitbucket for use in the URL
                 * Deprecated: use Repositories instead. Will be unsupported in v1.9
                 * +optional
                 */
                repositorySlug?: string;
                /**
                 * Webhook refers to the configuration required to run an http server
                 */
                webhook?: /* WebhookContext holds a general purpose REST API context */ IoArgoprojEventsV1alpha1WebhookContext;
            }
            export interface IoArgoprojEventsV1alpha1BitbucketRepository {
                /**
                 * Owner is the owner of the repository
                 */
                owner?: string;
                /**
                 * RepositorySlug is a URL-friendly version of a repository name, automatically generated by Bitbucket for use in the URL
                 */
                repositorySlug?: string;
            }
            /**
             * BitbucketServerEventSource refers to event-source related to Bitbucket Server events
             */
            export interface IoArgoprojEventsV1alpha1BitbucketServerEventSource {
                /**
                 * AccessToken is reference to K8s secret which holds the bitbucket api access information
                 */
                accessToken?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * BitbucketServerBaseURL is the base URL for API requests to a custom endpoint
                 */
                bitbucketserverBaseURL?: string;
                /**
                 * DeleteHookOnFinish determines whether to delete the Bitbucket Server hook for the project once the event source is stopped.
                 * +optional
                 */
                deleteHookOnFinish?: boolean;
                /**
                 * Events are bitbucket event to listen to.
                 * Refer https://confluence.atlassian.com/bitbucketserver/event-payload-938025882.html
                 */
                events?: string[];
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * DeprecatedProjectKey is the key of project for which integration needs to set up
                 * Deprecated: use Repositories instead. Will be unsupported in v1.8
                 * +optional
                 */
                projectKey?: string;
                /**
                 * Repositories holds a list of repositories for which integration needs to set up
                 * +optional
                 */
                repositories?: IoArgoprojEventsV1alpha1BitbucketServerRepository[];
                /**
                 * DeprecatedRepositorySlug is the slug of the repository for which integration needs to set up
                 * Deprecated: use Repositories instead. Will be unsupported in v1.8
                 * +optional
                 */
                repositorySlug?: string;
                /**
                 * Webhook holds configuration to run a http server
                 */
                webhook?: /* WebhookContext holds a general purpose REST API context */ IoArgoprojEventsV1alpha1WebhookContext;
                /**
                 * WebhookSecret is reference to K8s secret which holds the bitbucket webhook secret (for HMAC validation)
                 */
                webhookSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            export interface IoArgoprojEventsV1alpha1BitbucketServerRepository {
                /**
                 * ProjectKey is the key of project for which integration needs to set up
                 */
                projectKey?: string;
                /**
                 * RepositorySlug is the slug of the repository for which integration needs to set up
                 */
                repositorySlug?: string;
            }
            /**
             * CalendarEventSource describes a time based dependency. One of the fields (schedule, interval, or recurrence) must be passed.
             * Schedule takes precedence over interval; interval takes precedence over recurrence
             */
            export interface IoArgoprojEventsV1alpha1CalendarEventSource {
                /**
                 * ExclusionDates defines the list of DATE-TIME exceptions for recurring events.
                 */
                exclusionDates?: string[];
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * Interval is a string that describes an interval duration, e.g. 1s, 30m, 2h...
                 * +optional
                 */
                interval?: string;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Persistence hold the configuration for event persistence
                 */
                persistence?: IoArgoprojEventsV1alpha1EventPersistence;
                /**
                 * Schedule is a cron-like expression. For reference, see: https://en.wikipedia.org/wiki/Cron
                 * +optional
                 */
                schedule?: string;
                /**
                 * Timezone in which to run the schedule
                 * +optional
                 */
                timezone?: string;
            }
            export interface IoArgoprojEventsV1alpha1CatchupConfiguration {
                /**
                 * Enabled enables to triggered the missed schedule when eventsource restarts
                 */
                enabled?: boolean;
                /**
                 * MaxDuration holds max catchup duration
                 */
                maxDuration?: string;
            }
            /**
             * Condition contains details about resource state
             */
            export interface IoArgoprojEventsV1alpha1Condition {
                /**
                 * Last time the condition transitioned from one status to another.
                 * +optional
                 */
                lastTransitionTime?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * Human-readable message indicating details about last transition.
                 * +optional
                 */
                message?: string;
                /**
                 * Unique, this should be a short, machine understandable string that gives the reason
                 * for condition's last transition. For example, "ImageNotFound"
                 * +optional
                 */
                reason?: string;
                /**
                 * Condition status, True, False or Unknown.
                 * +required
                 */
                status?: string;
                /**
                 * Condition type.
                 * +required
                 */
                type?: string;
            }
            export interface IoArgoprojEventsV1alpha1ConditionsResetByTime {
                /**
                 * Cron is a cron-like expression. For reference, see: https://en.wikipedia.org/wiki/Cron
                 */
                cron?: string;
                /**
                 * +optional
                 */
                timezone?: string;
            }
            export interface IoArgoprojEventsV1alpha1ConditionsResetCriteria {
                /**
                 * Schedule is a cron-like expression. For reference, see: https://en.wikipedia.org/wiki/Cron
                 */
                byTime?: IoArgoprojEventsV1alpha1ConditionsResetByTime;
            }
            export interface IoArgoprojEventsV1alpha1ConfigMapPersistence {
                /**
                 * CreateIfNotExist will create configmap if it doesn't exists
                 */
                createIfNotExist?: boolean;
                /**
                 * Name of the configmap
                 */
                name?: string;
            }
            /**
             * CustomTrigger refers to the specification of the custom trigger.
             */
            export interface IoArgoprojEventsV1alpha1CustomTrigger {
                /**
                 * CertSecret refers to the secret that contains cert for secure connection between sensor and custom trigger gRPC server.
                 */
                certSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Parameters is the list of parameters that is applied to resolved custom trigger trigger object.
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Payload is the list of key-value extracted from an event payload to construct the request payload.
                 */
                payload?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Secure refers to type of the connection between sensor to custom trigger gRPC
                 */
                secure?: boolean;
                /**
                 * ServerNameOverride for the secure connection between sensor and custom trigger gRPC server.
                 */
                serverNameOverride?: string;
                /**
                 * ServerURL is the url of the gRPC server that executes custom trigger
                 */
                serverURL?: string;
                /**
                 * Spec is the custom trigger resource specification that custom trigger gRPC server knows how to interpret.
                 */
                spec?: {
                    [name: string]: string;
                };
            }
            /**
             * DataFilter describes constraints and filters for event data
             * Regular Expressions are purposefully not a feature as they are overkill for our uses here
             * See Rob Pike's Post: https://commandcenter.blogspot.com/2011/08/regular-expressions-in-lexing-and.html
             */
            export interface IoArgoprojEventsV1alpha1DataFilter {
                /**
                 * Comparator compares the event data with a user given value.
                 * Can be ">=", ">", "=", "!=", "<", or "<=".
                 * Is optional, and if left blank treated as equality "=".
                 */
                comparator?: string;
                /**
                 * Path is the JSONPath of the event's (JSON decoded) data key
                 * Path is a series of keys separated by a dot. A key may contain wildcard characters '*' and '?'.
                 * To access an array value use the index as the key. The dot and wildcard characters can be escaped with '\\'.
                 * See https://github.com/tidwall/gjson#path-syntax for more information on how to use this.
                 */
                path?: string;
                /**
                 * Template is a go-template for extracting a string from the event's data.
                 * A Template is evaluated with provided path, type and value.
                 * The templating follows the standard go-template syntax as well as sprig's extra functions.
                 * See https://pkg.go.dev/text/template and https://masterminds.github.io/sprig/
                 */
                template?: string;
                /**
                 * Type contains the JSON type of the data
                 */
                type?: string;
                /**
                 * Value is the allowed string values for this key
                 * Booleans are passed using strconv.ParseBool()
                 * Numbers are parsed using as float64 using strconv.ParseFloat()
                 * Strings are taken as is
                 * Nils this value is ignored
                 */
                value?: string[];
            }
            /**
             * EmitterEventSource describes the event source for emitter
             * More info at https://emitter.io/develop/getting-started/
             */
            export interface IoArgoprojEventsV1alpha1EmitterEventSource {
                /**
                 * Broker URI to connect to.
                 */
                broker?: string;
                /**
                 * ChannelKey refers to the channel key
                 */
                channelKey?: string;
                /**
                 * ChannelName refers to the channel name
                 */
                channelName?: string;
                /**
                 * Backoff holds parameters applied to connection.
                 * +optional
                 */
                connectionBackoff?: /* Backoff for an operation */ IoArgoprojEventsV1alpha1Backoff;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Password to use to connect to broker
                 * +optional
                 */
                password?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * TLS configuration for the emitter client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * Username to use to connect to broker
                 * +optional
                 */
                username?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * EventContext holds the context of the cloudevent received from an event source.
             * +protobuf.options.(gogoproto.goproto_stringer)=false
             */
            export interface IoArgoprojEventsV1alpha1EventContext {
                /**
                 * DataContentType - A MIME (RFC2046) string describing the media type of `data`.
                 */
                datacontenttype?: string;
                /**
                 * ID of the event; must be non-empty and unique within the scope of the producer.
                 */
                id?: string;
                /**
                 * Source - A URI describing the event producer.
                 */
                source?: string;
                /**
                 * SpecVersion - The version of the CloudEvents specification used by the io.argoproj.workflow.v1alpha1.
                 */
                specversion?: string;
                /**
                 * Subject - The subject of the event in the context of the event producer
                 */
                subject?: string;
                /**
                 * Time - A Timestamp when the event happened.
                 */
                time?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * Type - The type of the occurrence which has happened.
                 */
                type?: string;
            }
            /**
             * EventDependency describes a dependency
             */
            export interface IoArgoprojEventsV1alpha1EventDependency {
                /**
                 * EventName is the name of the event
                 */
                eventName?: string;
                /**
                 * EventSourceName is the name of EventSource that Sensor depends on
                 */
                eventSourceName?: string;
                /**
                 * Filters and rules governing toleration of success and constraints on the context and data of an event
                 */
                filters?: /* EventDependencyFilter defines filters and constraints for a io.argoproj.workflow.v1alpha1. */ IoArgoprojEventsV1alpha1EventDependencyFilter;
                /**
                 * FiltersLogicalOperator defines how different filters are evaluated together.
                 * Available values: and (&&), or (||)
                 * Is optional and if left blank treated as and (&&).
                 */
                filtersLogicalOperator?: string;
                /**
                 * Name is a unique name of this dependency
                 */
                name?: string;
                /**
                 * Transform transforms the event data
                 */
                transform?: /* EventDependencyTransformer transforms the event */ IoArgoprojEventsV1alpha1EventDependencyTransformer;
            }
            /**
             * EventDependencyFilter defines filters and constraints for a io.argoproj.workflow.v1alpha1.
             */
            export interface IoArgoprojEventsV1alpha1EventDependencyFilter {
                /**
                 * Context filter constraints
                 */
                context?: /**
                 * EventContext holds the context of the cloudevent received from an event source.
                 * +protobuf.options.(gogoproto.goproto_stringer)=false
                 */
                IoArgoprojEventsV1alpha1EventContext;
                /**
                 * Data filter constraints with escalation
                 */
                data?: /**
                 * DataFilter describes constraints and filters for event data
                 * Regular Expressions are purposefully not a feature as they are overkill for our uses here
                 * See Rob Pike's Post: https://commandcenter.blogspot.com/2011/08/regular-expressions-in-lexing-and.html
                 */
                IoArgoprojEventsV1alpha1DataFilter[];
                /**
                 * DataLogicalOperator defines how multiple Data filters (if defined) are evaluated together.
                 * Available values: and (&&), or (||)
                 * Is optional and if left blank treated as and (&&).
                 */
                dataLogicalOperator?: string;
                /**
                 * ExprLogicalOperator defines how multiple Exprs filters (if defined) are evaluated together.
                 * Available values: and (&&), or (||)
                 * Is optional and if left blank treated as and (&&).
                 */
                exprLogicalOperator?: string;
                /**
                 * Exprs contains the list of expressions evaluated against the event payload.
                 */
                exprs?: IoArgoprojEventsV1alpha1ExprFilter[];
                /**
                 * Script refers to a Lua script evaluated to determine the validity of an io.argoproj.workflow.v1alpha1.
                 */
                script?: string;
                /**
                 * Time filter on the event with escalation
                 */
                time?: /**
                 * TimeFilter describes a window in time.
                 * It filters out events that occur outside the time limits.
                 * In other words, only events that occur after Start and before Stop
                 * will pass this filter.
                 */
                IoArgoprojEventsV1alpha1TimeFilter;
            }
            /**
             * EventDependencyTransformer transforms the event
             */
            export interface IoArgoprojEventsV1alpha1EventDependencyTransformer {
                /**
                 * JQ holds the jq command applied for transformation
                 * +optional
                 */
                jq?: string;
                /**
                 * Script refers to a Lua script used to transform the event
                 * +optional
                 */
                script?: string;
            }
            export interface IoArgoprojEventsV1alpha1EventPersistence {
                /**
                 * Catchup enables to triggered the missed schedule when eventsource restarts
                 */
                catchup?: IoArgoprojEventsV1alpha1CatchupConfiguration;
                /**
                 * ConfigMap holds configmap details for persistence
                 */
                configMap?: IoArgoprojEventsV1alpha1ConfigMapPersistence;
            }
            /**
             * EventSource is the definition of a eventsource resource
             * +genclient
             * +kubebuilder:resource:shortName=es
             * +kubebuilder:subresource:status
             * +k8s:deepcopy-gen:interfaces=io.k8s.apimachinery/pkg/runtime.Object
             * +k8s:openapi-gen=true
             */
            export interface IoArgoprojEventsV1alpha1EventSource {
                metadata?: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                spec?: /* EventSourceSpec refers to specification of event-source resource */ IoArgoprojEventsV1alpha1EventSourceSpec;
                /**
                 * +optional
                 */
                status?: /* EventSourceStatus holds the status of the event-source resource */ IoArgoprojEventsV1alpha1EventSourceStatus;
            }
            export interface IoArgoprojEventsV1alpha1EventSourceFilter {
                expression?: string;
            }
            /**
             * EventSourceSpec refers to specification of event-source resource
             */
            export interface IoArgoprojEventsV1alpha1EventSourceSpec {
                /**
                 * AMQP event sources
                 */
                amqp?: {
                    [name: string]: /* AMQPEventSource refers to an event-source for AMQP stream events */ IoArgoprojEventsV1alpha1AMQPEventSource;
                };
                /**
                 * AzureEventsHub event sources
                 */
                azureEventsHub?: {
                    [name: string]: /**
                     * AzureEventsHubEventSource describes the event source for azure events hub
                     * More info at https://docs.microsoft.com/en-us/azure/event-hubs/
                     */
                    IoArgoprojEventsV1alpha1AzureEventsHubEventSource;
                };
                /**
                 * Bitbucket event sources
                 */
                bitbucket?: {
                    [name: string]: /* BitbucketEventSource describes the event source for Bitbucket */ IoArgoprojEventsV1alpha1BitbucketEventSource;
                };
                /**
                 * Bitbucket Server event sources
                 */
                bitbucketserver?: {
                    [name: string]: /* BitbucketServerEventSource refers to event-source related to Bitbucket Server events */ IoArgoprojEventsV1alpha1BitbucketServerEventSource;
                };
                /**
                 * Calendar event sources
                 */
                calendar?: {
                    [name: string]: /**
                     * CalendarEventSource describes a time based dependency. One of the fields (schedule, interval, or recurrence) must be passed.
                     * Schedule takes precedence over interval; interval takes precedence over recurrence
                     */
                    IoArgoprojEventsV1alpha1CalendarEventSource;
                };
                /**
                 * Emitter event source
                 */
                emitter?: {
                    [name: string]: /**
                     * EmitterEventSource describes the event source for emitter
                     * More info at https://emitter.io/develop/getting-started/
                     */
                    IoArgoprojEventsV1alpha1EmitterEventSource;
                };
                /**
                 * EventBusName references to a EventBus name. By default the value is "default"
                 */
                eventBusName?: string;
                /**
                 * File event sources
                 */
                file?: {
                    [name: string]: /* FileEventSource describes an event-source for file related events. */ IoArgoprojEventsV1alpha1FileEventSource;
                };
                /**
                 * Generic event source
                 */
                generic?: {
                    [name: string]: /* GenericEventSource refers to a generic event source. It can be used to implement a custom event source. */ IoArgoprojEventsV1alpha1GenericEventSource;
                };
                /**
                 * Github event sources
                 */
                github?: {
                    [name: string]: /* GithubEventSource refers to event-source for github related events */ IoArgoprojEventsV1alpha1GithubEventSource;
                };
                /**
                 * Gitlab event sources
                 */
                gitlab?: {
                    [name: string]: /* GitlabEventSource refers to event-source related to Gitlab events */ IoArgoprojEventsV1alpha1GitlabEventSource;
                };
                /**
                 * HDFS event sources
                 */
                hdfs?: {
                    [name: string]: /* HDFSEventSource refers to event-source for HDFS related events */ IoArgoprojEventsV1alpha1HDFSEventSource;
                };
                /**
                 * Kafka event sources
                 */
                kafka?: {
                    [name: string]: /* KafkaEventSource refers to event-source for Kafka related events */ IoArgoprojEventsV1alpha1KafkaEventSource;
                };
                /**
                 * Minio event sources
                 */
                minio?: {
                    [name: string]: /* S3Artifact contains information about an S3 connection and bucket */ IoArgoprojEventsV1alpha1S3Artifact;
                };
                /**
                 * MQTT event sources
                 */
                mqtt?: {
                    [name: string]: /* MQTTEventSource refers to event-source for MQTT related events */ IoArgoprojEventsV1alpha1MQTTEventSource;
                };
                /**
                 * NATS event sources
                 */
                nats?: {
                    [name: string]: /* NATSEventsSource refers to event-source for NATS related events */ IoArgoprojEventsV1alpha1NATSEventsSource;
                };
                /**
                 * NSQ event source
                 */
                nsq?: {
                    [name: string]: /**
                     * NSQEventSource describes the event source for NSQ PubSub
                     * More info at https://godoc.org/github.com/nsqio/go-nsq
                     */
                    IoArgoprojEventsV1alpha1NSQEventSource;
                };
                /**
                 * PubSub event sources
                 */
                pubSub?: {
                    [name: string]: /* PubSubEventSource refers to event-source for GCP PubSub related events. */ IoArgoprojEventsV1alpha1PubSubEventSource;
                };
                /**
                 * Pulsar event source
                 */
                pulsar?: {
                    [name: string]: /* PulsarEventSource describes the event source for Apache Pulsar */ IoArgoprojEventsV1alpha1PulsarEventSource;
                };
                /**
                 * Redis event source
                 */
                redis?: {
                    [name: string]: /**
                     * RedisEventSource describes an event source for the Redis PubSub.
                     * More info at https://godoc.org/github.com/go-redis/redis#example-PubSub
                     */
                    IoArgoprojEventsV1alpha1RedisEventSource;
                };
                /**
                 * Redis stream source
                 */
                redisStream?: {
                    [name: string]: /**
                     * RedisStreamEventSource describes an event source for
                     * Redis streams (https://redis.io/topics/streams-intro)
                     */
                    IoArgoprojEventsV1alpha1RedisStreamEventSource;
                };
                /**
                 * Replicas is the event source deployment replicas
                 */
                replicas?: number;
                /**
                 * Resource event sources
                 */
                resource?: {
                    [name: string]: /* ResourceEventSource refers to a event-source for K8s resource related events. */ IoArgoprojEventsV1alpha1ResourceEventSource;
                };
                /**
                 * Service is the specifications of the service to expose the event source
                 * +optional
                 */
                service?: /* Service holds the service information eventsource exposes */ IoArgoprojEventsV1alpha1Service;
                /**
                 * Slack event sources
                 */
                slack?: {
                    [name: string]: /* SlackEventSource refers to event-source for Slack related events */ IoArgoprojEventsV1alpha1SlackEventSource;
                };
                /**
                 * SNS event sources
                 */
                sns?: {
                    [name: string]: /* SNSEventSource refers to event-source for AWS SNS related events */ IoArgoprojEventsV1alpha1SNSEventSource;
                };
                /**
                 * SQS event sources
                 */
                sqs?: {
                    [name: string]: /* SQSEventSource refers to event-source for AWS SQS related events */ IoArgoprojEventsV1alpha1SQSEventSource;
                };
                /**
                 * StorageGrid event sources
                 */
                storageGrid?: {
                    [name: string]: /* StorageGridEventSource refers to event-source for StorageGrid related events */ IoArgoprojEventsV1alpha1StorageGridEventSource;
                };
                /**
                 * Stripe event sources
                 */
                stripe?: {
                    [name: string]: /**
                     * StripeEventSource describes the event source for stripe webhook notifications
                     * More info at https://stripe.com/docs/webhooks
                     */
                    IoArgoprojEventsV1alpha1StripeEventSource;
                };
                /**
                 * Template is the pod specification for the event source
                 * +optional
                 */
                template?: /* Template holds the information of a sensor deployment template */ IoArgoprojEventsV1alpha1Template;
                /**
                 * Webhook event sources
                 */
                webhook?: {
                    [name: string]: /* CalendarEventSource describes an HTTP based EventSource */ IoArgoprojEventsV1alpha1WebhookEventSource;
                };
            }
            /**
             * EventSourceStatus holds the status of the event-source resource
             */
            export interface IoArgoprojEventsV1alpha1EventSourceStatus {
                status?: /* Status is a common structure which can be used for Status field. */ IoArgoprojEventsV1alpha1Status;
            }
            export interface IoArgoprojEventsV1alpha1ExprFilter {
                /**
                 * Expr refers to the expression that determines the outcome of the filter.
                 */
                expr?: string;
                /**
                 * Fields refers to set of keys that refer to the paths within event payload.
                 */
                fields?: /* PayloadField binds a value at path within the event payload against a name. */ IoArgoprojEventsV1alpha1PayloadField[];
            }
            /**
             * FileArtifact contains information about an artifact in a filesystem
             */
            export interface IoArgoprojEventsV1alpha1FileArtifact {
                path?: string;
            }
            /**
             * FileEventSource describes an event-source for file related events.
             */
            export interface IoArgoprojEventsV1alpha1FileEventSource {
                /**
                 * Type of file operations to watch
                 * Refer https://github.com/fsnotify/fsnotify/blob/master/fsnotify.go for more information
                 */
                eventType?: string;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Use polling instead of inotify
                 */
                polling?: boolean;
                /**
                 * WatchPathConfig contains configuration about the file path to watch
                 */
                watchPathConfig?: IoArgoprojEventsV1alpha1WatchPathConfig;
            }
            /**
             * GenericEventSource refers to a generic event source. It can be used to implement a custom event source.
             */
            export interface IoArgoprojEventsV1alpha1GenericEventSource {
                /**
                 * AuthSecret holds a secret selector that contains a bearer token for authentication
                 * +optional
                 */
                authSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Config is the event source configuration
                 */
                config?: string;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * Insecure determines the type of connection.
                 */
                insecure?: boolean;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * URL of the gRPC server that implements the event source.
                 */
                url?: string;
            }
            /**
             * GitArtifact contains information about an artifact stored in git
             */
            export interface IoArgoprojEventsV1alpha1GitArtifact {
                /**
                 * Branch to use to pull trigger resource
                 * +optional
                 */
                branch?: string;
                /**
                 * Directory to clone the repository. We clone complete directory because GitArtifact is not limited to any specific Git service providers.
                 * Hence we don't use any specific git provider client.
                 */
                cloneDirectory?: string;
                /**
                 * Creds contain reference to git username and password
                 * +optional
                 */
                creds?: /* GitCreds contain reference to git username and password */ IoArgoprojEventsV1alpha1GitCreds;
                /**
                 * Path to file that contains trigger resource definition
                 */
                filePath?: string;
                /**
                 * Whether to ignore host key
                 * +optional
                 */
                insecureIgnoreHostKey?: boolean;
                /**
                 * Ref to use to pull trigger resource. Will result in a shallow clone and
                 * fetch.
                 * +optional
                 */
                ref?: string;
                /**
                 * Remote to manage set of tracked repositories. Defaults to "origin".
                 * Refer https://git-scm.com/docs/git-remote
                 * +optional
                 */
                remote?: /* GitRemoteConfig contains the configuration of a Git remote */ IoArgoprojEventsV1alpha1GitRemoteConfig;
                /**
                 * SSHKeySecret refers to the secret that contains SSH key
                 */
                sshKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Tag to use to pull trigger resource
                 * +optional
                 */
                tag?: string;
                /**
                 * Git URL
                 */
                url?: string;
            }
            /**
             * GitCreds contain reference to git username and password
             */
            export interface IoArgoprojEventsV1alpha1GitCreds {
                password?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                username?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * GitRemoteConfig contains the configuration of a Git remote
             */
            export interface IoArgoprojEventsV1alpha1GitRemoteConfig {
                /**
                 * Name of the remote to fetch from.
                 */
                name?: string;
                /**
                 * URLs the URLs of a remote repository. It must be non-empty. Fetch will
                 * always use the first URL, while push will use all of them.
                 */
                urls?: string[];
            }
            export interface IoArgoprojEventsV1alpha1GithubAppCreds {
                /**
                 * AppID refers to the GitHub App ID for the application you created
                 */
                appID?: string;
                /**
                 * InstallationID refers to the Installation ID of the GitHub app you created and installed
                 */
                installationID?: string;
                /**
                 * PrivateKey refers to a K8s secret containing the GitHub app private key
                 */
                privateKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * GithubEventSource refers to event-source for github related events
             */
            export interface IoArgoprojEventsV1alpha1GithubEventSource {
                /**
                 * Active refers to status of the webhook for event deliveries.
                 * https://developer.github.com/webhooks/creating/#active
                 * +optional
                 */
                active?: boolean;
                /**
                 * APIToken refers to a K8s secret containing github api token
                 * +optional
                 */
                apiToken?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * ContentType of the event delivery
                 */
                contentType?: string;
                /**
                 * DeleteHookOnFinish determines whether to delete the GitHub hook for the repository once the event source is stopped.
                 * +optional
                 */
                deleteHookOnFinish?: boolean;
                /**
                 * Events refer to Github events to which the event source will subscribe
                 */
                events?: string[];
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * GitHubApp holds the GitHub app credentials
                 * +optional
                 */
                githubApp?: IoArgoprojEventsV1alpha1GithubAppCreds;
                /**
                 * GitHub base URL (for GitHub Enterprise)
                 * +optional
                 */
                githubBaseURL?: string;
                /**
                 * GitHub upload URL (for GitHub Enterprise)
                 * +optional
                 */
                githubUploadURL?: string;
                /**
                 * Id is the webhook's id
                 * Deprecated: This is not used at all, will be removed in v1.6
                 * +optional
                 */
                id?: string;
                /**
                 * Insecure tls verification
                 */
                insecure?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Organizations holds the names of organizations (used for organization level webhooks). Not required if Repositories is set.
                 */
                organizations?: string[];
                /**
                 * DeprecatedOwner refers to GitHub owner name i.e. argoproj
                 * Deprecated: use Repositories instead. Will be unsupported in v 1.6
                 * +optional
                 */
                owner?: string;
                /**
                 * Repositories holds the information of repositories, which uses repo owner as the key,
                 * and list of repo names as the value. Not required if Organizations is set.
                 */
                repositories?: IoArgoprojEventsV1alpha1OwnedRepositories[];
                /**
                 * DeprecatedRepository refers to GitHub repo name i.e. argo-events
                 * Deprecated: use Repositories instead. Will be unsupported in v 1.6
                 * +optional
                 */
                repository?: string;
                /**
                 * Webhook refers to the configuration required to run a http server
                 */
                webhook?: /* WebhookContext holds a general purpose REST API context */ IoArgoprojEventsV1alpha1WebhookContext;
                /**
                 * WebhookSecret refers to K8s secret containing GitHub webhook secret
                 * https://developer.github.com/webhooks/securing/
                 * +optional
                 */
                webhookSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * GitlabEventSource refers to event-source related to Gitlab events
             */
            export interface IoArgoprojEventsV1alpha1GitlabEventSource {
                /**
                 * AccessToken references to k8 secret which holds the gitlab api access information
                 */
                accessToken?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * DeleteHookOnFinish determines whether to delete the GitLab hook for the project once the event source is stopped.
                 * +optional
                 */
                deleteHookOnFinish?: boolean;
                /**
                 * EnableSSLVerification to enable ssl verification
                 * +optional
                 */
                enableSSLVerification?: boolean;
                /**
                 * Events are gitlab event to listen to.
                 * Refer https://github.com/xanzy/go-gitlab/blob/bf34eca5d13a9f4c3f501d8a97b8ac226d55e4d9/projects.go#L794.
                 */
                events?: string[];
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * GitlabBaseURL is the base URL for API requests to a custom endpoint
                 */
                gitlabBaseURL?: string;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * DeprecatedProjectID is the id of project for which integration needs to setup
                 * Deprecated: use Projects instead. Will be unsupported in v 1.7
                 * +optional
                 */
                projectID?: string;
                /**
                 * List of project IDs or project namespace paths like "whynowy/test"
                 */
                projects?: string[];
                /**
                 * SecretToken references to k8 secret which holds the Secret Token used by webhook config
                 */
                secretToken?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Webhook holds configuration to run a http server
                 */
                webhook?: /* WebhookContext holds a general purpose REST API context */ IoArgoprojEventsV1alpha1WebhookContext;
            }
            /**
             * HDFSEventSource refers to event-source for HDFS related events
             */
            export interface IoArgoprojEventsV1alpha1HDFSEventSource {
                addresses?: string[];
                /**
                 * CheckInterval is a string that describes an interval duration to check the directory state, e.g. 1s, 30m, 2h... (defaults to 1m)
                 */
                checkInterval?: string;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * HDFSUser is the user to access HDFS file system.
                 * It is ignored if either ccache or keytab is used.
                 */
                hdfsUser?: string;
                /**
                 * KrbCCacheSecret is the secret selector for Kerberos ccache
                 * Either ccache or keytab can be set to use Kerberos.
                 */
                krbCCacheSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * KrbConfig is the configmap selector for Kerberos config as string
                 * It must be set if either ccache or keytab is used.
                 */
                krbConfigConfigMap?: /* Selects a key from a ConfigMap. */ IoK8sApiCoreV1ConfigMapKeySelector;
                /**
                 * KrbKeytabSecret is the secret selector for Kerberos keytab
                 * Either ccache or keytab can be set to use Kerberos.
                 */
                krbKeytabSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * KrbRealm is the Kerberos realm used with Kerberos keytab
                 * It must be set if keytab is used.
                 */
                krbRealm?: string;
                /**
                 * KrbServicePrincipalName is the principal name of Kerberos service
                 * It must be set if either ccache or keytab is used.
                 */
                krbServicePrincipalName?: string;
                /**
                 * KrbUsername is the Kerberos username used with Kerberos keytab
                 * It must be set if keytab is used.
                 */
                krbUsername?: string;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Type of file operations to watch
                 */
                type?: string;
                watchPathConfig?: IoArgoprojEventsV1alpha1WatchPathConfig;
            }
            /**
             * HTTPTrigger is the trigger for the HTTP request
             */
            export interface IoArgoprojEventsV1alpha1HTTPTrigger {
                /**
                 * BasicAuth configuration for the http request.
                 * +optional
                 */
                basicAuth?: /* BasicAuth contains the reference to K8s secrets that holds the username and password */ IoArgoprojEventsV1alpha1BasicAuth;
                /**
                 * Headers for the HTTP request.
                 * +optional
                 */
                headers?: {
                    [name: string]: string;
                };
                /**
                 * Method refers to the type of the HTTP request.
                 * Refer https://golang.org/src/net/http/method.go for more io.argoproj.workflow.v1alpha1.
                 * Default value is POST.
                 * +optional
                 */
                method?: string;
                /**
                 * Parameters is the list of key-value extracted from event's payload that are applied to
                 * the HTTP trigger resource.
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                payload?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Secure Headers stored in Kubernetes Secrets for the HTTP requests.
                 * +optional
                 */
                secureHeaders?: /* SecureHeader refers to HTTP Headers with auth tokens as values */ IoArgoprojEventsV1alpha1SecureHeader[];
                /**
                 * Timeout refers to the HTTP request timeout in seconds.
                 * Default value is 60 seconds.
                 * +optional
                 */
                timeout?: string;
                /**
                 * TLS configuration for the HTTP client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * URL refers to the URL to send HTTP request to.
                 */
                url?: string;
            }
            export interface IoArgoprojEventsV1alpha1Int64OrString {
                int64Val?: string;
                strVal?: string;
                type?: string;
            }
            /**
             * K8SResourcePolicy refers to the policy used to check the state of K8s based triggers using labels
             */
            export interface IoArgoprojEventsV1alpha1K8SResourcePolicy {
                /**
                 * Backoff before checking resource state
                 */
                backoff?: /* Backoff for an operation */ IoArgoprojEventsV1alpha1Backoff;
                /**
                 * ErrorOnBackoffTimeout determines whether sensor should transition to error state if the trigger policy is unable to determine
                 * the state of the resource
                 */
                errorOnBackoffTimeout?: boolean;
                /**
                 * Labels required to identify whether a resource is in success state
                 */
                labels?: {
                    [name: string]: string;
                };
            }
            export interface IoArgoprojEventsV1alpha1KafkaConsumerGroup {
                /**
                 * The name for the consumer group to use
                 */
                groupName?: string;
                /**
                 * When starting up a new group do we want to start from the oldest event (true) or the newest event (false), defaults to false
                 * +optional
                 */
                oldest?: boolean;
                /**
                 * Rebalance strategy can be one of: sticky, roundrobin, range. Range is the default.
                 * +optional
                 */
                rebalanceStrategy?: string;
            }
            /**
             * KafkaEventSource refers to event-source for Kafka related events
             */
            export interface IoArgoprojEventsV1alpha1KafkaEventSource {
                /**
                 * Yaml format Sarama config for Kafka connection.
                 * It follows the struct of sarama.Config. See https://github.com/Shopify/sarama/blob/main/config.go
                 * e.g.
                 *
                 * consumer:
                 *   fetch:
                 *     min: 1
                 * net:
                 *   MaxOpenRequests: 5
                 *
                 * +optional
                 */
                config?: string;
                /**
                 * Backoff holds parameters applied to connection.
                 */
                connectionBackoff?: /* Backoff for an operation */ IoArgoprojEventsV1alpha1Backoff;
                /**
                 * Consumer group for kafka client
                 * +optional
                 */
                consumerGroup?: IoArgoprojEventsV1alpha1KafkaConsumerGroup;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Sets a limit on how many events get read from kafka per second.
                 * +optional
                 */
                limitEventsPerSecond?: string;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Partition name
                 */
                partition?: string;
                /**
                 * SASL configuration for the kafka client
                 * +optional
                 */
                sasl?: /* SASLConfig refers to SASL configuration for a client */ IoArgoprojEventsV1alpha1SASLConfig;
                /**
                 * TLS configuration for the kafka client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * Topic name
                 */
                topic?: string;
                /**
                 * URL to kafka cluster, multiple URLs separated by comma
                 */
                url?: string;
                /**
                 * Specify what kafka version is being connected to enables certain features in sarama, defaults to 1.0.0
                 * +optional
                 */
                version?: string;
            }
            /**
             * KafkaTrigger refers to the specification of the Kafka trigger.
             */
            export interface IoArgoprojEventsV1alpha1KafkaTrigger {
                /**
                 * Compress determines whether to compress message or not.
                 * Defaults to false.
                 * If set to true, compresses message using snappy compression.
                 * +optional
                 */
                compress?: boolean;
                /**
                 * FlushFrequency refers to the frequency in milliseconds to flush batches.
                 * Defaults to 500 milliseconds.
                 * +optional
                 */
                flushFrequency?: number;
                /**
                 * Parameters is the list of parameters that is applied to resolved Kafka trigger object.
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Partition to write data to.
                 */
                partition?: number;
                /**
                 * The partitioning key for the messages put on the Kafka topic.
                 * Defaults to broker url.
                 * +optional.
                 */
                partitioningKey?: string;
                /**
                 * Payload is the list of key-value extracted from an event payload to construct the request payload.
                 */
                payload?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * RequiredAcks used in producer to tell the broker how many replica acknowledgements
                 * Defaults to 1 (Only wait for the leader to ack).
                 * +optional.
                 */
                requiredAcks?: number;
                /**
                 * SASL configuration for the kafka client
                 * +optional
                 */
                sasl?: /* SASLConfig refers to SASL configuration for a client */ IoArgoprojEventsV1alpha1SASLConfig;
                /**
                 * TLS configuration for the Kafka producer.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * Name of the topic.
                 * More info at https://kafka.apache.org/documentation/#intro_topics
                 */
                topic?: string;
                /**
                 * URL of the Kafka broker, multiple URLs separated by comma.
                 */
                url?: string;
                /**
                 * Specify what kafka version is being connected to enables certain features in sarama, defaults to 1.0.0
                 * +optional
                 */
                version?: string;
            }
            export interface IoArgoprojEventsV1alpha1LogTrigger {
                /**
                 * Only print messages every interval. Useful to prevent logging too much data for busy events.
                 * +optional
                 */
                intervalSeconds?: string; // uint64
            }
            /**
             * MQTTEventSource refers to event-source for MQTT related events
             */
            export interface IoArgoprojEventsV1alpha1MQTTEventSource {
                /**
                 * ClientID is the id of the client
                 */
                clientId?: string;
                /**
                 * ConnectionBackoff holds backoff applied to connection.
                 */
                connectionBackoff?: /* Backoff for an operation */ IoArgoprojEventsV1alpha1Backoff;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * TLS configuration for the mqtt client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * Topic name
                 */
                topic?: string;
                /**
                 * URL to connect to broker
                 */
                url?: string;
            }
            /**
             * Metadata holds the annotations and labels of an event source pod
             */
            export interface IoArgoprojEventsV1alpha1Metadata {
                annotations?: {
                    [name: string]: string;
                };
                labels?: {
                    [name: string]: string;
                };
            }
            /**
             * NATSAuth refers to the auth info for NATS EventSource
             */
            export interface IoArgoprojEventsV1alpha1NATSAuth {
                /**
                 * Baisc auth with username and password
                 * +optional
                 */
                basic?: /* BasicAuth contains the reference to K8s secrets that holds the username and password */ IoArgoprojEventsV1alpha1BasicAuth;
                /**
                 * credential used to connect
                 * +optional
                 */
                credential?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * NKey used to connect
                 * +optional
                 */
                nkey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Token used to connect
                 * +optional
                 */
                token?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * NATSEventsSource refers to event-source for NATS related events
             */
            export interface IoArgoprojEventsV1alpha1NATSEventsSource {
                /**
                 * Auth information
                 * +optional
                 */
                auth?: /* NATSAuth refers to the auth info for NATS EventSource */ IoArgoprojEventsV1alpha1NATSAuth;
                /**
                 * ConnectionBackoff holds backoff applied to connection.
                 */
                connectionBackoff?: /* Backoff for an operation */ IoArgoprojEventsV1alpha1Backoff;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Subject holds the name of the subject onto which messages are published
                 */
                subject?: string;
                /**
                 * TLS configuration for the nats client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * URL to connect to NATS cluster
                 */
                url?: string;
            }
            /**
             * NATSTrigger refers to the specification of the NATS trigger.
             */
            export interface IoArgoprojEventsV1alpha1NATSTrigger {
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                payload?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Name of the subject to put message on.
                 */
                subject?: string;
                /**
                 * TLS configuration for the NATS producer.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * URL of the NATS cluster.
                 */
                url?: string;
            }
            /**
             * NSQEventSource describes the event source for NSQ PubSub
             * More info at https://godoc.org/github.com/nsqio/go-nsq
             */
            export interface IoArgoprojEventsV1alpha1NSQEventSource {
                /**
                 * Channel used for subscription
                 */
                channel?: string;
                /**
                 * Backoff holds parameters applied to connection.
                 * +optional
                 */
                connectionBackoff?: /* Backoff for an operation */ IoArgoprojEventsV1alpha1Backoff;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * HostAddress is the address of the host for NSQ lookup
                 */
                hostAddress?: string;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * TLS configuration for the nsq client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * Topic to subscribe to.
                 */
                topic?: string;
            }
            /**
             * OpenWhiskTrigger refers to the specification of the OpenWhisk trigger.
             */
            export interface IoArgoprojEventsV1alpha1OpenWhiskTrigger {
                /**
                 * Name of the action/function.
                 */
                actionName?: string;
                /**
                 * AuthToken for authentication.
                 * +optional
                 */
                authToken?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Host URL of the OpenWhisk.
                 */
                host?: string;
                /**
                 * Namespace for the action.
                 * Defaults to "_".
                 * +optional.
                 */
                namespace?: string;
                /**
                 * Parameters is the list of key-value extracted from event's payload that are applied to
                 * the trigger resource.
                 * +optional
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Payload is the list of key-value extracted from an event payload to construct the request payload.
                 */
                payload?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Version for the API.
                 * Defaults to v1.
                 * +optional
                 */
                version?: string;
            }
            export interface IoArgoprojEventsV1alpha1OwnedRepositories {
                /**
                 * Repository names
                 */
                names?: string[];
                /**
                 * Organization or user name
                 */
                owner?: string;
            }
            /**
             * PayloadField binds a value at path within the event payload against a name.
             */
            export interface IoArgoprojEventsV1alpha1PayloadField {
                /**
                 * Name acts as key that holds the value at the path.
                 */
                name?: string;
                /**
                 * Path is the JSONPath of the event's (JSON decoded) data key
                 * Path is a series of keys separated by a dot. A key may contain wildcard characters '*' and '?'.
                 * To access an array value use the index as the key. The dot and wildcard characters can be escaped with '\\'.
                 * See https://github.com/tidwall/gjson#path-syntax for more information on how to use this.
                 */
                path?: string;
            }
            /**
             * PubSubEventSource refers to event-source for GCP PubSub related events.
             */
            export interface IoArgoprojEventsV1alpha1PubSubEventSource {
                /**
                 * CredentialSecret references to the secret that contains JSON credentials to access GCP.
                 * If it is missing, it implicitly uses Workload Identity to access.
                 * https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity
                 * +optional
                 */
                credentialSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * DeleteSubscriptionOnFinish determines whether to delete the GCP PubSub subscription once the event source is stopped.
                 * +optional
                 */
                deleteSubscriptionOnFinish?: boolean;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * ProjectID is GCP project ID for the subscription.
                 * Required if you run Argo Events outside of GKE/GCE.
                 * (otherwise, the default value is its project)
                 * +optional
                 */
                projectID?: string;
                /**
                 * SubscriptionID is ID of subscription.
                 * Required if you use existing subscription.
                 * The default value will be auto generated hash based on this eventsource setting, so the subscription
                 * might be recreated every time you update the setting, which has a possibility of event loss.
                 * +optional
                 */
                subscriptionID?: string;
                /**
                 * Topic to which the subscription should belongs.
                 * Required if you want the eventsource to create a new subscription.
                 * If you specify this field along with an existing subscription,
                 * it will be verified whether it actually belongs to the specified topic.
                 * +optional
                 */
                topic?: string;
                /**
                 * TopicProjectID is GCP project ID for the topic.
                 * By default, it is same as ProjectID.
                 * +optional
                 */
                topicProjectID?: string;
            }
            /**
             * PulsarEventSource describes the event source for Apache Pulsar
             */
            export interface IoArgoprojEventsV1alpha1PulsarEventSource {
                /**
                 * Authentication token for the pulsar client.
                 * +optional
                 */
                authTokenSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Backoff holds parameters applied to connection.
                 * +optional
                 */
                connectionBackoff?: /* Backoff for an operation */ IoArgoprojEventsV1alpha1Backoff;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * TLS configuration for the pulsar client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * Whether the Pulsar client accept untrusted TLS certificate from broker.
                 * +optional
                 */
                tlsAllowInsecureConnection?: boolean;
                /**
                 * Trusted TLS certificate secret.
                 * +optional
                 */
                tlsTrustCertsSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Whether the Pulsar client verify the validity of the host name from broker.
                 * +optional
                 */
                tlsValidateHostname?: boolean;
                /**
                 * Name of the topics to subscribe to.
                 * +required
                 */
                topics?: string[];
                /**
                 * Type of the subscription.
                 * Only "exclusive" and "shared" is supported.
                 * Defaults to exclusive.
                 * +optional
                 */
                type?: string;
                /**
                 * Configure the service URL for the Pulsar service.
                 * +required
                 */
                url?: string;
            }
            /**
             * PulsarTrigger refers to the specification of the Pulsar trigger.
             */
            export interface IoArgoprojEventsV1alpha1PulsarTrigger {
                /**
                 * Authentication token for the pulsar client.
                 * +optional
                 */
                authTokenSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Backoff holds parameters applied to connection.
                 * +optional
                 */
                connectionBackoff?: /* Backoff for an operation */ IoArgoprojEventsV1alpha1Backoff;
                /**
                 * Parameters is the list of parameters that is applied to resolved Kafka trigger object.
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Payload is the list of key-value extracted from an event payload to construct the request payload.
                 */
                payload?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * TLS configuration for the pulsar client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * Whether the Pulsar client accept untrusted TLS certificate from broker.
                 * +optional
                 */
                tlsAllowInsecureConnection?: boolean;
                /**
                 * Trusted TLS certificate secret.
                 * +optional
                 */
                tlsTrustCertsSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Whether the Pulsar client verify the validity of the host name from broker.
                 * +optional
                 */
                tlsValidateHostname?: boolean;
                /**
                 * Name of the topic.
                 * See https://pulsar.apache.org/docs/en/concepts-messaging/
                 */
                topic?: string;
                /**
                 * Configure the service URL for the Pulsar service.
                 * +required
                 */
                url?: string;
            }
            export interface IoArgoprojEventsV1alpha1RateLimit {
                requestsPerUnit?: number;
                /**
                 * Defaults to Second
                 */
                unit?: string;
            }
            /**
             * RedisEventSource describes an event source for the Redis PubSub.
             * More info at https://godoc.org/github.com/go-redis/redis#example-PubSub
             */
            export interface IoArgoprojEventsV1alpha1RedisEventSource {
                channels?: string[];
                /**
                 * DB to use. If not specified, default DB 0 will be used.
                 * +optional
                 */
                db?: number;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * HostAddress refers to the address of the Redis host/server
                 */
                hostAddress?: string;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Namespace to use to retrieve the password from. It should only be specified if password is declared
                 * +optional
                 */
                namespace?: string;
                /**
                 * Password required for authentication if any.
                 * +optional
                 */
                password?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * TLS configuration for the redis client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * Username required for ACL style authentication if any.
                 * +optional
                 */
                username?: string;
            }
            /**
             * RedisStreamEventSource describes an event source for
             * Redis streams (https://redis.io/topics/streams-intro)
             */
            export interface IoArgoprojEventsV1alpha1RedisStreamEventSource {
                /**
                 * ConsumerGroup refers to the Redis stream consumer group that will be
                 * created on all redis streams. Messages are read through this group. Defaults to 'argo-events-cg'
                 * +optional
                 */
                consumerGroup?: string;
                /**
                 * DB to use. If not specified, default DB 0 will be used.
                 * +optional
                 */
                db?: number;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * HostAddress refers to the address of the Redis host/server (master instance)
                 */
                hostAddress?: string;
                /**
                 * MaxMsgCountPerRead holds the maximum number of messages per stream that will be read in each XREADGROUP of all streams
                 * Example: if there are 2 streams and MaxMsgCountPerRead=10, then each XREADGROUP may read upto a total of 20 messages.
                 * Same as COUNT option in XREADGROUP(https://redis.io/topics/streams-intro). Defaults to 10
                 * +optional
                 */
                maxMsgCountPerRead?: number;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Password required for authentication if any.
                 * +optional
                 */
                password?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Streams to look for entries. XREADGROUP is used on all streams using a single consumer group.
                 */
                streams?: string[];
                /**
                 * TLS configuration for the redis client.
                 * +optional
                 */
                tls?: /* TLSConfig refers to TLS configuration for a client. */ IoArgoprojEventsV1alpha1TLSConfig;
                /**
                 * Username required for ACL style authentication if any.
                 * +optional
                 */
                username?: string;
            }
            /**
             * Resource represent arbitrary structured data.
             */
            export interface IoArgoprojEventsV1alpha1Resource {
                value?: string; // byte
            }
            /**
             * ResourceEventSource refers to a event-source for K8s resource related events.
             */
            export interface IoArgoprojEventsV1alpha1ResourceEventSource {
                /**
                 * EventTypes is the list of event type to watch.
                 * Possible values are - ADD, UPDATE and DELETE.
                 */
                eventTypes?: string[];
                /**
                 * Filter is applied on the metadata of the resource
                 * If you apply filter, then the internal event informer will only monitor objects that pass the filter.
                 * +optional
                 */
                filter?: /* ResourceFilter contains K8s ObjectMeta information to further filter resource event objects */ IoArgoprojEventsV1alpha1ResourceFilter;
                /**
                 * Group of the resource
                 */
                groupVersionResource?: /**
                 * GroupVersionResource unambiguously identifies a resource.  It doesn't anonymously include GroupVersion
                 * to avoid automatic coercion.  It doesn't use a GroupVersion to avoid custom marshalling
                 * +protobuf.options.(gogoproto.goproto_stringer)=false
                 */
                IoK8sApimachineryPkgApisMetaV1GroupVersionResource;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Namespace where resource is deployed
                 */
                namespace?: string;
            }
            /**
             * ResourceFilter contains K8s ObjectMeta information to further filter resource event objects
             */
            export interface IoArgoprojEventsV1alpha1ResourceFilter {
                /**
                 * If the resource is created after the start time then the event is treated as valid.
                 * +optional
                 */
                afterStart?: boolean;
                /**
                 * If resource is created before the specified time then the event is treated as valid.
                 * +optional
                 */
                createdBy?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * Fields provide field filters similar to K8s field selector
                 * (see https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors/).
                 * Unlike K8s field selector, it supports arbitrary fileds like "spec.serviceAccountName",
                 * and the value could be a string or a regex.
                 * Same as K8s field selector, operator "=", "==" and "!=" are supported.
                 * +optional
                 */
                fields?: /* Selector represents conditional operation to select K8s objects. */ IoArgoprojEventsV1alpha1Selector[];
                /**
                 * Labels provide listing options to K8s API to watch resource/s.
                 * Refer https://kubernetes.io/docs/concepts/overview/working-with-objects/label-selectors/ for more io.argoproj.workflow.v1alpha1.
                 * +optional
                 */
                labels?: /* Selector represents conditional operation to select K8s objects. */ IoArgoprojEventsV1alpha1Selector[];
                /**
                 * Prefix filter is applied on the resource name.
                 * +optional
                 */
                prefix?: string;
            }
            /**
             * S3Artifact contains information about an S3 connection and bucket
             */
            export interface IoArgoprojEventsV1alpha1S3Artifact {
                accessKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                bucket?: /* S3Bucket contains information to describe an S3 Bucket */ IoArgoprojEventsV1alpha1S3Bucket;
                endpoint?: string;
                events?: string[];
                filter?: /* S3Filter represents filters to apply to bucket notifications for specifying constraints on objects */ IoArgoprojEventsV1alpha1S3Filter;
                insecure?: boolean;
                metadata?: {
                    [name: string]: string;
                };
                region?: string;
                secretKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * S3Bucket contains information to describe an S3 Bucket
             */
            export interface IoArgoprojEventsV1alpha1S3Bucket {
                key?: string;
                name?: string;
            }
            /**
             * S3Filter represents filters to apply to bucket notifications for specifying constraints on objects
             */
            export interface IoArgoprojEventsV1alpha1S3Filter {
                prefix?: string;
                suffix?: string;
            }
            /**
             * SASLConfig refers to SASL configuration for a client
             */
            export interface IoArgoprojEventsV1alpha1SASLConfig {
                /**
                 * SASLMechanism is the name of the enabled SASL mechanism.
                 * Possible values: OAUTHBEARER, PLAIN (defaults to PLAIN).
                 * +optional
                 */
                mechanism?: string;
                /**
                 * Password for SASL/PLAIN authentication
                 */
                password?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * User is the authentication identity (authcid) to present for
                 * SASL/PLAIN or SASL/SCRAM authentication
                 */
                user?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * SNSEventSource refers to event-source for AWS SNS related events
             */
            export interface IoArgoprojEventsV1alpha1SNSEventSource {
                /**
                 * AccessKey refers K8s secret containing aws access key
                 */
                accessKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Endpoint configures connection to a specific SNS endpoint instead of Amazons servers
                 * +optional
                 */
                endpoint?: string;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Region is AWS region
                 */
                region?: string;
                /**
                 * RoleARN is the Amazon Resource Name (ARN) of the role to assume.
                 * +optional
                 */
                roleARN?: string;
                /**
                 * SecretKey refers K8s secret containing aws secret key
                 */
                secretKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * TopicArn
                 */
                topicArn?: string;
                /**
                 * ValidateSignature is boolean that can be set to true for SNS signature verification
                 * +optional
                 */
                validateSignature?: boolean;
                /**
                 * Webhook configuration for http server
                 */
                webhook?: /* WebhookContext holds a general purpose REST API context */ IoArgoprojEventsV1alpha1WebhookContext;
            }
            /**
             * SQSEventSource refers to event-source for AWS SQS related events
             */
            export interface IoArgoprojEventsV1alpha1SQSEventSource {
                /**
                 * AccessKey refers K8s secret containing aws access key
                 */
                accessKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * DLQ specifies if a dead-letter queue is configured for messages that can't be processed successfully.
                 * If set to true, messages with invalid payload won't be acknowledged to allow to forward them farther to the dead-letter queue.
                 * The default value is false.
                 * +optional
                 */
                dlq?: boolean;
                /**
                 * Endpoint configures connection to a specific SQS endpoint instead of Amazons servers
                 * +optional
                 */
                endpoint?: string;
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * JSONBody specifies that all event body payload coming from this
                 * source will be JSON
                 * +optional
                 */
                jsonBody?: boolean;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Queue is AWS SQS queue to listen to for messages
                 */
                queue?: string;
                /**
                 * QueueAccountID is the ID of the account that created the queue to monitor
                 * +optional
                 */
                queueAccountId?: string;
                /**
                 * Region is AWS region
                 */
                region?: string;
                /**
                 * RoleARN is the Amazon Resource Name (ARN) of the role to assume.
                 * +optional
                 */
                roleARN?: string;
                /**
                 * SecretKey refers K8s secret containing aws secret key
                 */
                secretKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * SessionToken refers to K8s secret containing AWS temporary credentials(STS) session token
                 * +optional
                 */
                sessionToken?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * WaitTimeSeconds is The duration (in seconds) for which the call waits for a message to arrive
                 * in the queue before returning.
                 */
                waitTimeSeconds?: string;
            }
            /**
             * SecureHeader refers to HTTP Headers with auth tokens as values
             */
            export interface IoArgoprojEventsV1alpha1SecureHeader {
                name?: string;
                /**
                 * Values can be read from either secrets or configmaps
                 */
                valueFrom?: /* ValueFromSource allows you to reference keys from either a Configmap or Secret */ IoArgoprojEventsV1alpha1ValueFromSource;
            }
            /**
             * Selector represents conditional operation to select K8s objects.
             */
            export interface IoArgoprojEventsV1alpha1Selector {
                /**
                 * Key name
                 */
                key?: string;
                /**
                 * Supported operations like ==, !=, <=, >= etc.
                 * Defaults to ==.
                 * Refer https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors for more io.argoproj.workflow.v1alpha1.
                 * +optional
                 */
                operation?: string;
                /**
                 * Value
                 */
                value?: string;
            }
            /**
             * Sensor is the definition of a sensor resource
             * +genclient
             * +genclient:noStatus
             * +kubebuilder:resource:shortName=sn
             * +kubebuilder:subresource:status
             * +k8s:deepcopy-gen:interfaces=io.k8s.apimachinery/pkg/runtime.Object
             * +k8s:openapi-gen=true
             */
            export interface IoArgoprojEventsV1alpha1Sensor {
                metadata?: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                spec?: /* SensorSpec represents desired sensor state */ IoArgoprojEventsV1alpha1SensorSpec;
                /**
                 * +optional
                 */
                status?: /* SensorStatus contains information about the status of a sensor. */ IoArgoprojEventsV1alpha1SensorStatus;
            }
            /**
             * SensorSpec represents desired sensor state
             */
            export interface IoArgoprojEventsV1alpha1SensorSpec {
                /**
                 * Dependencies is a list of the events that this sensor is dependent on.
                 */
                dependencies?: /* EventDependency describes a dependency */ IoArgoprojEventsV1alpha1EventDependency[];
                /**
                 * ErrorOnFailedRound if set to true, marks sensor state as `error` if the previous trigger round fails.
                 * Once sensor state is set to `error`, no further triggers will be processed.
                 */
                errorOnFailedRound?: boolean;
                /**
                 * EventBusName references to a EventBus name. By default the value is "default"
                 */
                eventBusName?: string;
                /**
                 * Replicas is the sensor deployment replicas
                 */
                replicas?: number;
                /**
                 * Template is the pod specification for the sensor
                 * +optional
                 */
                template?: /* Template holds the information of a sensor deployment template */ IoArgoprojEventsV1alpha1Template;
                /**
                 * Triggers is a list of the things that this sensor evokes. These are the outputs from this sensor.
                 */
                triggers?: /* Trigger is an action taken, output produced, an event created, a message sent */ IoArgoprojEventsV1alpha1Trigger[];
            }
            /**
             * SensorStatus contains information about the status of a sensor.
             */
            export interface IoArgoprojEventsV1alpha1SensorStatus {
                status?: /* Status is a common structure which can be used for Status field. */ IoArgoprojEventsV1alpha1Status;
            }
            /**
             * Service holds the service information eventsource exposes
             */
            export interface IoArgoprojEventsV1alpha1Service {
                /**
                 * clusterIP is the IP address of the service and is usually assigned
                 * randomly by the master. If an address is specified manually and is not in
                 * use by others, it will be allocated to the service; otherwise, creation
                 * of the service will fail. This field can not be changed through updates.
                 * Valid values are "None", empty string (""), or a valid IP address. "None"
                 * can be specified for headless services when proxying is not required.
                 * More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies
                 * +optional
                 */
                clusterIP?: string;
                /**
                 * The list of ports that are exposed by this ClusterIP service.
                 * +patchMergeKey=port
                 * +patchStrategy=merge
                 * +listType=map
                 * +listMapKey=port
                 * +listMapKey=protocol
                 */
                ports?: /* ServicePort contains information on service's port. */ IoK8sApiCoreV1ServicePort[];
            }
            /**
             * SlackEventSource refers to event-source for Slack related events
             */
            export interface IoArgoprojEventsV1alpha1SlackEventSource {
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Slack App signing secret
                 */
                signingSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Token for URL verification handshake
                 */
                token?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Webhook holds configuration for a REST endpoint
                 */
                webhook?: /* WebhookContext holds a general purpose REST API context */ IoArgoprojEventsV1alpha1WebhookContext;
            }
            /**
             * SlackTrigger refers to the specification of the slack notification trigger.
             */
            export interface IoArgoprojEventsV1alpha1SlackTrigger {
                /**
                 * Channel refers to which Slack channel to send slack message.
                 * +optional
                 */
                channel?: string;
                /**
                 * Message refers to the message to send to the Slack channel.
                 * +optional
                 */
                message?: string;
                /**
                 * Parameters is the list of key-value extracted from event's payload that are applied to
                 * the trigger resource.
                 * +optional
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * SlackToken refers to the Kubernetes secret that holds the slack token required to send messages.
                 */
                slackToken?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * StandardK8STrigger is the standard Kubernetes resource trigger
             */
            export interface IoArgoprojEventsV1alpha1StandardK8STrigger {
                /**
                 * LiveObject specifies whether the resource should be directly fetched from K8s instead
                 * of being marshaled from the resource artifact. If set to true, the resource artifact
                 * must contain the information required to uniquely identify the resource in the cluster,
                 * that is, you must specify "apiVersion", "kind" as well as "name" and "namespace" meta
                 * data.
                 * Only valid for operation type `update`
                 * +optional
                 */
                liveObject?: boolean;
                /**
                 * Operation refers to the type of operation performed on the k8s resource.
                 * Default value is Create.
                 * +optional
                 */
                operation?: string;
                /**
                 * Parameters is the list of parameters that is applied to resolved K8s trigger object.
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * PatchStrategy controls the K8s object patching strategy when the trigger operation is specified as patch.
                 * possible values:
                 * "application/json-patch+json"
                 * "application/merge-patch+json"
                 * "application/strategic-merge-patch+json"
                 * "application/apply-patch+yaml".
                 * Defaults to "application/merge-patch+json"
                 * +optional
                 */
                patchStrategy?: string;
                /**
                 * Source of the K8s resource file(s)
                 */
                source?: /* ArtifactLocation describes the source location for an external artifact */ IoArgoprojEventsV1alpha1ArtifactLocation;
            }
            /**
             * Status is a common structure which can be used for Status field.
             */
            export interface IoArgoprojEventsV1alpha1Status {
                /**
                 * Conditions are the latest available observations of a resource's current state.
                 * +optional
                 * +patchMergeKey=type
                 * +patchStrategy=merge
                 */
                conditions?: /* Condition contains details about resource state */ IoArgoprojEventsV1alpha1Condition[];
            }
            /**
             * StatusPolicy refers to the policy used to check the state of the trigger using response status
             */
            export interface IoArgoprojEventsV1alpha1StatusPolicy {
                allow?: number /* int32 */[];
            }
            /**
             * StorageGridEventSource refers to event-source for StorageGrid related events
             */
            export interface IoArgoprojEventsV1alpha1StorageGridEventSource {
                /**
                 * APIURL is the url of the storagegrid api.
                 */
                apiURL?: string;
                /**
                 * Auth token for storagegrid api
                 */
                authToken?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Name of the bucket to register notifications for.
                 */
                bucket?: string;
                events?: string[];
                /**
                 * Filter on object key which caused the notification.
                 */
                filter?: /**
                 * StorageGridFilter represents filters to apply to bucket notifications for specifying constraints on objects
                 * +k8s:openapi-gen=true
                 */
                IoArgoprojEventsV1alpha1StorageGridFilter;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * S3 region.
                 * Defaults to us-east-1
                 * +optional
                 */
                region?: string;
                /**
                 * TopicArn
                 */
                topicArn?: string;
                /**
                 * Webhook holds configuration for a REST endpoint
                 */
                webhook?: /* WebhookContext holds a general purpose REST API context */ IoArgoprojEventsV1alpha1WebhookContext;
            }
            /**
             * StorageGridFilter represents filters to apply to bucket notifications for specifying constraints on objects
             * +k8s:openapi-gen=true
             */
            export interface IoArgoprojEventsV1alpha1StorageGridFilter {
                prefix?: string;
                suffix?: string;
            }
            /**
             * StripeEventSource describes the event source for stripe webhook notifications
             * More info at https://stripe.com/docs/webhooks
             */
            export interface IoArgoprojEventsV1alpha1StripeEventSource {
                /**
                 * APIKey refers to K8s secret that holds Stripe API key. Used only if CreateWebhook is enabled.
                 * +optional
                 */
                apiKey?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * CreateWebhook if specified creates a new webhook programmatically.
                 * +optional
                 */
                createWebhook?: boolean;
                /**
                 * EventFilter describes the type of events to listen to. If not specified, all types of events will be processed.
                 * More info at https://stripe.com/docs/api/events/list
                 * +optional
                 */
                eventFilter?: string[];
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Webhook holds configuration for a REST endpoint
                 */
                webhook?: /* WebhookContext holds a general purpose REST API context */ IoArgoprojEventsV1alpha1WebhookContext;
            }
            /**
             * TLSConfig refers to TLS configuration for a client.
             */
            export interface IoArgoprojEventsV1alpha1TLSConfig {
                /**
                 * CACertSecret refers to the secret that contains the CA cert
                 */
                caCertSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * ClientCertSecret refers to the secret that contains the client cert
                 */
                clientCertSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * ClientKeySecret refers to the secret that contains the client key
                 */
                clientKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * If true, skips creation of TLSConfig with certs and creates an empty TLSConfig. (Defaults to false)
                 * +optional
                 */
                insecureSkipVerify?: boolean;
            }
            /**
             * Template holds the information of a sensor deployment template
             */
            export interface IoArgoprojEventsV1alpha1Template {
                /**
                 * If specified, the pod's scheduling constraints
                 * +optional
                 */
                affinity?: /* Affinity is a group of affinity scheduling rules. */ IoK8sApiCoreV1Affinity;
                /**
                 * Container is the main container image to run in the sensor pod
                 * +optional
                 */
                container?: /* A single application container that you want to run within a pod. */ IoK8sApiCoreV1Container;
                /**
                 * ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec.
                 * If specified, these secrets will be passed to individual puller implementations for them to use. For example,
                 * in the case of docker, only DockerConfig type secrets are honored.
                 * More info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod
                 * +optional
                 * +patchMergeKey=name
                 * +patchStrategy=merge
                 */
                imagePullSecrets?: /* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */ IoK8sApiCoreV1LocalObjectReference[];
                /**
                 * Metadata sets the pods's metadata, i.e. annotations and labels
                 */
                metadata?: /* Metadata holds the annotations and labels of an event source pod */ IoArgoprojEventsV1alpha1Metadata;
                /**
                 * NodeSelector is a selector which must be true for the pod to fit on a node.
                 * Selector which must match a node's labels for the pod to be scheduled on that node.
                 * More info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
                 * +optional
                 */
                nodeSelector?: {
                    [name: string]: string;
                };
                /**
                 * The priority value. Various system components use this field to find the
                 * priority of the EventSource pod. When Priority Admission Controller is enabled,
                 * it prevents users from setting this field. The admission controller populates
                 * this field from PriorityClassName.
                 * The higher the value, the higher the priority.
                 * More info: https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/
                 * +optional
                 */
                priority?: number;
                /**
                 * If specified, indicates the EventSource pod's priority. "system-node-critical"
                 * and "system-cluster-critical" are two special keywords which indicate the
                 * highest priorities with the former being the highest priority. Any other
                 * name must be defined by creating a PriorityClass object with that name.
                 * If not specified, the pod priority will be default or zero if there is no
                 * default.
                 * More info: https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/
                 * +optional
                 */
                priorityClassName?: string;
                /**
                 * SecurityContext holds pod-level security attributes and common container settings.
                 * Optional: Defaults to empty.  See type description for default values of each field.
                 * +optional
                 */
                securityContext?: /* PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext. */ IoK8sApiCoreV1PodSecurityContext;
                /**
                 * ServiceAccountName is the name of the ServiceAccount to use to run sensor pod.
                 * More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
                 * +optional
                 */
                serviceAccountName?: string;
                /**
                 * If specified, the pod's tolerations.
                 * +optional
                 */
                tolerations?: /* The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>. */ IoK8sApiCoreV1Toleration[];
                /**
                 * Volumes is a list of volumes that can be mounted by containers in a io.argoproj.workflow.v1alpha1.
                 * +patchStrategy=merge
                 * +patchMergeKey=name
                 * +optional
                 */
                volumes?: /* Volume represents a named volume in a pod that may be accessed by any container in the pod. */ IoK8sApiCoreV1Volume[];
            }
            /**
             * TimeFilter describes a window in time.
             * It filters out events that occur outside the time limits.
             * In other words, only events that occur after Start and before Stop
             * will pass this filter.
             */
            export interface IoArgoprojEventsV1alpha1TimeFilter {
                /**
                 * Start is the beginning of a time window in UTC.
                 * Before this time, events for this dependency are ignored.
                 * Format is hh:mm:ss.
                 */
                start?: string;
                /**
                 * Stop is the end of a time window in UTC.
                 * After or equal to this time, events for this dependency are ignored and
                 * Format is hh:mm:ss.
                 * If it is smaller than Start, it is treated as next day of Start
                 * (e.g.: 22:00:00-01:00:00 means 22:00:00-25:00:00).
                 */
                stop?: string;
            }
            /**
             * Trigger is an action taken, output produced, an event created, a message sent
             */
            export interface IoArgoprojEventsV1alpha1Trigger {
                /**
                 * Parameters is the list of parameters applied to the trigger template definition
                 */
                parameters?: /* TriggerParameter indicates a passed parameter to a service template */ IoArgoprojEventsV1alpha1TriggerParameter[];
                /**
                 * Policy to configure backoff and execution criteria for the trigger
                 * +optional
                 */
                policy?: /* TriggerPolicy dictates the policy for the trigger retries */ IoArgoprojEventsV1alpha1TriggerPolicy;
                /**
                 * Rate limit, default unit is Second
                 * +optional
                 */
                rateLimit?: IoArgoprojEventsV1alpha1RateLimit;
                /**
                 * Retry strategy, defaults to no retry
                 * +optional
                 */
                retryStrategy?: /* Backoff for an operation */ IoArgoprojEventsV1alpha1Backoff;
                /**
                 * Template describes the trigger specification.
                 */
                template?: /* TriggerTemplate is the template that describes trigger specification. */ IoArgoprojEventsV1alpha1TriggerTemplate;
            }
            /**
             * TriggerParameter indicates a passed parameter to a service template
             */
            export interface IoArgoprojEventsV1alpha1TriggerParameter {
                /**
                 * Dest is the JSONPath of a resource key.
                 * A path is a series of keys separated by a dot. The colon character can be escaped with '.'
                 * The -1 key can be used to append a value to an existing array.
                 * See https://github.com/tidwall/sjson#path-syntax for more information about how this is used.
                 */
                dest?: string;
                /**
                 * Operation is what to do with the existing value at Dest, whether to
                 * 'prepend', 'overwrite', or 'append' it.
                 */
                operation?: string;
                /**
                 * Src contains a source reference to the value of the parameter from a dependency
                 */
                src?: /* TriggerParameterSource defines the source for a parameter from a event event */ IoArgoprojEventsV1alpha1TriggerParameterSource;
            }
            /**
             * TriggerParameterSource defines the source for a parameter from a event event
             */
            export interface IoArgoprojEventsV1alpha1TriggerParameterSource {
                /**
                 * ContextKey is the JSONPath of the event's (JSON decoded) context key
                 * ContextKey is a series of keys separated by a dot. A key may contain wildcard characters '*' and '?'.
                 * To access an array value use the index as the key. The dot and wildcard characters can be escaped with '\\'.
                 * See https://github.com/tidwall/gjson#path-syntax for more information on how to use this.
                 */
                contextKey?: string;
                /**
                 * ContextTemplate is a go-template for extracting a string from the event's context.
                 * If a ContextTemplate is provided with a ContextKey, the template will be evaluated first and fallback to the ContextKey.
                 * The templating follows the standard go-template syntax as well as sprig's extra functions.
                 * See https://pkg.go.dev/text/template and https://masterminds.github.io/sprig/
                 */
                contextTemplate?: string;
                /**
                 * DataKey is the JSONPath of the event's (JSON decoded) data key
                 * DataKey is a series of keys separated by a dot. A key may contain wildcard characters '*' and '?'.
                 * To access an array value use the index as the key. The dot and wildcard characters can be escaped with '\\'.
                 * See https://github.com/tidwall/gjson#path-syntax for more information on how to use this.
                 */
                dataKey?: string;
                /**
                 * DataTemplate is a go-template for extracting a string from the event's data.
                 * If a DataTemplate is provided with a DataKey, the template will be evaluated first and fallback to the DataKey.
                 * The templating follows the standard go-template syntax as well as sprig's extra functions.
                 * See https://pkg.go.dev/text/template and https://masterminds.github.io/sprig/
                 */
                dataTemplate?: string;
                /**
                 * DependencyName refers to the name of the dependency. The event which is stored for this dependency is used as payload
                 * for the parameterization. Make sure to refer to one of the dependencies you have defined under Dependencies list.
                 */
                dependencyName?: string;
                /**
                 * Value is the default literal value to use for this parameter source
                 * This is only used if the DataKey is invalid.
                 * If the DataKey is invalid and this is not defined, this param source will produce an error.
                 */
                value?: string;
            }
            /**
             * TriggerPolicy dictates the policy for the trigger retries
             */
            export interface IoArgoprojEventsV1alpha1TriggerPolicy {
                /**
                 * K8SResourcePolicy refers to the policy used to check the state of K8s based triggers using using labels
                 */
                k8s?: /* K8SResourcePolicy refers to the policy used to check the state of K8s based triggers using labels */ IoArgoprojEventsV1alpha1K8SResourcePolicy;
                /**
                 * Status refers to the policy used to check the state of the trigger using response status
                 */
                status?: /* StatusPolicy refers to the policy used to check the state of the trigger using response status */ IoArgoprojEventsV1alpha1StatusPolicy;
            }
            /**
             * TriggerTemplate is the template that describes trigger specification.
             */
            export interface IoArgoprojEventsV1alpha1TriggerTemplate {
                /**
                 * ArgoWorkflow refers to the trigger that can perform various operations on an Argo io.argoproj.workflow.v1alpha1.
                 * +optional
                 */
                argoWorkflow?: /* ArgoWorkflowTrigger is the trigger for the Argo Workflow */ IoArgoprojEventsV1alpha1ArgoWorkflowTrigger;
                /**
                 * AWSLambda refers to the trigger designed to invoke AWS Lambda function with with on-the-fly constructable payload.
                 * +optional
                 */
                awsLambda?: /* AWSLambdaTrigger refers to specification of the trigger to invoke an AWS Lambda function */ IoArgoprojEventsV1alpha1AWSLambdaTrigger;
                /**
                 * AzureEventHubs refers to the trigger send an event to an Azure Event Hub.
                 * +optional
                 */
                azureEventHubs?: /* AzureEventHubsTrigger refers to specification of the Azure Event Hubs Trigger */ IoArgoprojEventsV1alpha1AzureEventHubsTrigger;
                /**
                 * Conditions is the conditions to execute the trigger.
                 * For example: "(dep01 || dep02) && dep04"
                 * +optional
                 */
                conditions?: string;
                /**
                 * Criteria to reset the conditons
                 * +optional
                 */
                conditionsReset?: IoArgoprojEventsV1alpha1ConditionsResetCriteria[];
                /**
                 * CustomTrigger refers to the trigger designed to connect to a gRPC trigger server and execute a custom trigger.
                 * +optional
                 */
                custom?: /* CustomTrigger refers to the specification of the custom trigger. */ IoArgoprojEventsV1alpha1CustomTrigger;
                /**
                 * HTTP refers to the trigger designed to dispatch a HTTP request with on-the-fly constructable payload.
                 * +optional
                 */
                http?: /* HTTPTrigger is the trigger for the HTTP request */ IoArgoprojEventsV1alpha1HTTPTrigger;
                /**
                 * StandardK8STrigger refers to the trigger designed to create or update a generic Kubernetes resource.
                 * +optional
                 */
                k8s?: /* StandardK8STrigger is the standard Kubernetes resource trigger */ IoArgoprojEventsV1alpha1StandardK8STrigger;
                /**
                 * Kafka refers to the trigger designed to place messages on Kafka topic.
                 * +optional.
                 */
                kafka?: /* KafkaTrigger refers to the specification of the Kafka trigger. */ IoArgoprojEventsV1alpha1KafkaTrigger;
                /**
                 * Log refers to the trigger designed to invoke log the io.argoproj.workflow.v1alpha1.
                 * +optional
                 */
                log?: IoArgoprojEventsV1alpha1LogTrigger;
                /**
                 * Name is a unique name of the action to take.
                 */
                name?: string;
                /**
                 * NATS refers to the trigger designed to place message on NATS subject.
                 * +optional.
                 */
                nats?: /* NATSTrigger refers to the specification of the NATS trigger. */ IoArgoprojEventsV1alpha1NATSTrigger;
                /**
                 * OpenWhisk refers to the trigger designed to invoke OpenWhisk action.
                 * +optional
                 */
                openWhisk?: /* OpenWhiskTrigger refers to the specification of the OpenWhisk trigger. */ IoArgoprojEventsV1alpha1OpenWhiskTrigger;
                /**
                 * Pulsar refers to the trigger designed to place messages on Pulsar topic.
                 * +optional
                 */
                pulsar?: /* PulsarTrigger refers to the specification of the Pulsar trigger. */ IoArgoprojEventsV1alpha1PulsarTrigger;
                /**
                 * Slack refers to the trigger designed to send slack notification message.
                 * +optional
                 */
                slack?: /* SlackTrigger refers to the specification of the slack notification trigger. */ IoArgoprojEventsV1alpha1SlackTrigger;
            }
            /**
             * URLArtifact contains information about an artifact at an http endpoint.
             */
            export interface IoArgoprojEventsV1alpha1URLArtifact {
                /**
                 * Path is the complete URL
                 */
                path?: string;
                /**
                 * VerifyCert decides whether the connection is secure or not
                 */
                verifyCert?: boolean;
            }
            /**
             * ValueFromSource allows you to reference keys from either a Configmap or Secret
             */
            export interface IoArgoprojEventsV1alpha1ValueFromSource {
                configMapKeyRef?: /* Selects a key from a ConfigMap. */ IoK8sApiCoreV1ConfigMapKeySelector;
                secretKeyRef?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            export interface IoArgoprojEventsV1alpha1WatchPathConfig {
                /**
                 * Directory to watch for events
                 */
                directory?: string;
                /**
                 * Path is relative path of object to watch with respect to the directory
                 */
                path?: string;
                /**
                 * PathRegexp is regexp of relative path of object to watch with respect to the directory
                 */
                pathRegexp?: string;
            }
            /**
             * WebhookContext holds a general purpose REST API context
             */
            export interface IoArgoprojEventsV1alpha1WebhookContext {
                /**
                 * AuthSecret holds a secret selector that contains a bearer token for authentication
                 * +optional
                 */
                authSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * REST API endpoint
                 */
                endpoint?: string;
                /**
                 * MaxPayloadSize is the maximum webhook payload size that the server will accept.
                 * Requests exceeding that limit will be rejected with "request too large" response.
                 * Default value: 1048576 (1MB).
                 * +optional
                 */
                maxPayloadSize?: string;
                /**
                 * Metadata holds the user defined metadata which will passed along the event payload.
                 * +optional
                 */
                metadata?: {
                    [name: string]: string;
                };
                /**
                 * Method is HTTP request method that indicates the desired action to be performed for a given resource.
                 * See RFC7231 Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content
                 */
                method?: string;
                /**
                 * Port on which HTTP server is listening for incoming events.
                 */
                port?: string;
                /**
                 * ServerCertPath refers the file that contains the cert.
                 */
                serverCertSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * ServerKeyPath refers the file that contains private key
                 */
                serverKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * URL is the url of the server.
                 */
                url?: string;
            }
            /**
             * CalendarEventSource describes an HTTP based EventSource
             */
            export interface IoArgoprojEventsV1alpha1WebhookEventSource {
                /**
                 * Filter
                 * +optional
                 */
                filter?: IoArgoprojEventsV1alpha1EventSourceFilter;
                webhookContext?: /* WebhookContext holds a general purpose REST API context */ IoArgoprojEventsV1alpha1WebhookContext;
            }
            /**
             * Amount represent a numeric amount.
             */
            export type IoArgoprojWorkflowV1alpha1Amount = number;
            /**
             * ArchiveStrategy describes how to archive files/directory when saving artifacts
             */
            export interface IoArgoprojWorkflowV1alpha1ArchiveStrategy {
                none?: /* NoneStrategy indicates to skip tar process and upload the files or directory tree as independent files. Note that if the artifact is a directory, the artifact driver must support the ability to save/load the directory appropriately. */ IoArgoprojWorkflowV1alpha1NoneStrategy;
                tar?: /* TarStrategy will tar and gzip the file or directory when saving */ IoArgoprojWorkflowV1alpha1TarStrategy;
                zip?: /* ZipStrategy will unzip zipped input artifacts */ IoArgoprojWorkflowV1alpha1ZipStrategy;
            }
            /**
             * Arguments to a template
             */
            export interface IoArgoprojWorkflowV1alpha1Arguments {
                /**
                 * Artifacts is the list of artifacts to pass to the template or workflow
                 */
                artifacts?: /* Artifact indicates an artifact to place at a specified path */ IoArgoprojWorkflowV1alpha1Artifact[];
                /**
                 * Parameters is the list of parameters to pass to the template or workflow
                 */
                parameters?: /* Parameter indicate a passed string parameter to a service template with an optional default value */ IoArgoprojWorkflowV1alpha1Parameter[];
            }
            /**
             * ArtGCStatus maintains state related to ArtifactGC
             */
            export interface IoArgoprojWorkflowV1alpha1ArtGCStatus {
                /**
                 * if this is true, we already checked to see if we need to do it and we don't
                 */
                notSpecified?: boolean;
                /**
                 * have completed Pods been processed? (mapped by Pod name) used to prevent re-processing the Status of a Pod more than once
                 */
                podsRecouped?: {
                    [name: string]: boolean;
                };
                /**
                 * have Pods been started to perform this strategy? (enables us not to re-process what we've already done)
                 */
                strategiesProcessed?: {
                    [name: string]: boolean;
                };
            }
            /**
             * Artifact indicates an artifact to place at a specified path
             */
            export interface IoArgoprojWorkflowV1alpha1Artifact {
                /**
                 * Archive controls how the artifact will be saved to the artifact repository.
                 */
                archive?: /* ArchiveStrategy describes how to archive files/directory when saving artifacts */ IoArgoprojWorkflowV1alpha1ArchiveStrategy;
                /**
                 * ArchiveLogs indicates if the container logs should be archived
                 */
                archiveLogs?: boolean;
                /**
                 * ArtifactGC describes the strategy to use when to deleting an artifact from completed or deleted workflows
                 */
                artifactGC?: /* ArtifactGC describes how to delete artifacts from completed Workflows - this is embedded into the WorkflowLevelArtifactGC, and also used for individual Artifacts to override that as needed */ IoArgoprojWorkflowV1alpha1ArtifactGC;
                /**
                 * Artifactory contains artifactory artifact location details
                 */
                artifactory?: /* ArtifactoryArtifact is the location of an artifactory artifact */ IoArgoprojWorkflowV1alpha1ArtifactoryArtifact;
                /**
                 * Azure contains Azure Storage artifact location details
                 */
                azure?: /* AzureArtifact is the location of a an Azure Storage artifact */ IoArgoprojWorkflowV1alpha1AzureArtifact;
                /**
                 * Has this been deleted?
                 */
                deleted?: boolean;
                /**
                 * From allows an artifact to reference an artifact from a previous step
                 */
                from?: string;
                /**
                 * FromExpression, if defined, is evaluated to specify the value for the artifact
                 */
                fromExpression?: string;
                /**
                 * GCS contains GCS artifact location details
                 */
                gcs?: /* GCSArtifact is the location of a GCS artifact */ IoArgoprojWorkflowV1alpha1GCSArtifact;
                /**
                 * Git contains git artifact location details
                 */
                git?: /* GitArtifact is the location of an git artifact */ IoArgoprojWorkflowV1alpha1GitArtifact;
                /**
                 * GlobalName exports an output artifact to the global scope, making it available as '{{io.argoproj.workflow.v1alpha1.outputs.artifacts.XXXX}} and in workflow.status.outputs.artifacts
                 */
                globalName?: string;
                /**
                 * HDFS contains HDFS artifact location details
                 */
                hdfs?: /* HDFSArtifact is the location of an HDFS artifact */ IoArgoprojWorkflowV1alpha1HDFSArtifact;
                /**
                 * HTTP contains HTTP artifact location details
                 */
                http?: /* HTTPArtifact allows a file served on HTTP to be placed as an input artifact in a container */ IoArgoprojWorkflowV1alpha1HTTPArtifact;
                /**
                 * mode bits to use on this file, must be a value between 0 and 0777 set when loading input artifacts.
                 */
                mode?: number;
                /**
                 * name of the artifact. must be unique within a template's inputs/outputs.
                 */
                name: string;
                /**
                 * Make Artifacts optional, if Artifacts doesn't generate or exist
                 */
                optional?: boolean;
                /**
                 * OSS contains OSS artifact location details
                 */
                oss?: /* OSSArtifact is the location of an Alibaba Cloud OSS artifact */ IoArgoprojWorkflowV1alpha1OSSArtifact;
                /**
                 * Path is the container path to the artifact
                 */
                path?: string;
                /**
                 * Raw contains raw artifact location details
                 */
                raw?: /* RawArtifact allows raw string content to be placed as an artifact in a container */ IoArgoprojWorkflowV1alpha1RawArtifact;
                /**
                 * If mode is set, apply the permission recursively into the artifact if it is a folder
                 */
                recurseMode?: boolean;
                /**
                 * S3 contains S3 artifact location details
                 */
                s3?: /* S3Artifact is the location of an S3 artifact */ IoArgoprojWorkflowV1alpha1S3Artifact;
                /**
                 * SubPath allows an artifact to be sourced from a subpath within the specified source
                 */
                subPath?: string;
            }
            /**
             * ArtifactGC describes how to delete artifacts from completed Workflows - this is embedded into the WorkflowLevelArtifactGC, and also used for individual Artifacts to override that as needed
             */
            export interface IoArgoprojWorkflowV1alpha1ArtifactGC {
                /**
                 * PodMetadata is an optional field for specifying the Labels and Annotations that should be assigned to the Pod doing the deletion
                 */
                podMetadata?: /* Pod metdata */ IoArgoprojWorkflowV1alpha1Metadata;
                /**
                 * ServiceAccountName is an optional field for specifying the Service Account that should be assigned to the Pod doing the deletion
                 */
                serviceAccountName?: string;
                /**
                 * Strategy is the strategy to use.
                 */
                strategy?: string;
            }
            /**
             * ArtifactLocation describes a location for a single or multiple artifacts. It is used as single artifact in the context of inputs/outputs (e.g. outputs.artifacts.artname). It is also used to describe the location of multiple artifacts such as the archive location of a single workflow step, which the executor will use as a default location to store its files.
             */
            export interface IoArgoprojWorkflowV1alpha1ArtifactLocation {
                /**
                 * ArchiveLogs indicates if the container logs should be archived
                 */
                archiveLogs?: boolean;
                /**
                 * Artifactory contains artifactory artifact location details
                 */
                artifactory?: /* ArtifactoryArtifact is the location of an artifactory artifact */ IoArgoprojWorkflowV1alpha1ArtifactoryArtifact;
                /**
                 * Azure contains Azure Storage artifact location details
                 */
                azure?: /* AzureArtifact is the location of a an Azure Storage artifact */ IoArgoprojWorkflowV1alpha1AzureArtifact;
                /**
                 * GCS contains GCS artifact location details
                 */
                gcs?: /* GCSArtifact is the location of a GCS artifact */ IoArgoprojWorkflowV1alpha1GCSArtifact;
                /**
                 * Git contains git artifact location details
                 */
                git?: /* GitArtifact is the location of an git artifact */ IoArgoprojWorkflowV1alpha1GitArtifact;
                /**
                 * HDFS contains HDFS artifact location details
                 */
                hdfs?: /* HDFSArtifact is the location of an HDFS artifact */ IoArgoprojWorkflowV1alpha1HDFSArtifact;
                /**
                 * HTTP contains HTTP artifact location details
                 */
                http?: /* HTTPArtifact allows a file served on HTTP to be placed as an input artifact in a container */ IoArgoprojWorkflowV1alpha1HTTPArtifact;
                /**
                 * OSS contains OSS artifact location details
                 */
                oss?: /* OSSArtifact is the location of an Alibaba Cloud OSS artifact */ IoArgoprojWorkflowV1alpha1OSSArtifact;
                /**
                 * Raw contains raw artifact location details
                 */
                raw?: /* RawArtifact allows raw string content to be placed as an artifact in a container */ IoArgoprojWorkflowV1alpha1RawArtifact;
                /**
                 * S3 contains S3 artifact location details
                 */
                s3?: /* S3Artifact is the location of an S3 artifact */ IoArgoprojWorkflowV1alpha1S3Artifact;
            }
            /**
             * ArtifactNodeSpec specifies the Artifacts that need to be deleted for a given Node
             */
            export interface IoArgoprojWorkflowV1alpha1ArtifactNodeSpec {
                /**
                 * ArchiveLocation is the template-level Artifact location specification
                 */
                archiveLocation?: /* ArtifactLocation describes a location for a single or multiple artifacts. It is used as single artifact in the context of inputs/outputs (e.g. outputs.artifacts.artname). It is also used to describe the location of multiple artifacts such as the archive location of a single workflow step, which the executor will use as a default location to store its files. */ IoArgoprojWorkflowV1alpha1ArtifactLocation;
                /**
                 * Artifacts maps artifact name to Artifact description
                 */
                artifacts?: {
                    [name: string]: /* Artifact indicates an artifact to place at a specified path */ IoArgoprojWorkflowV1alpha1Artifact;
                };
            }
            /**
             * ArtifactPaths expands a step from a collection of artifacts
             */
            export interface IoArgoprojWorkflowV1alpha1ArtifactPaths {
                /**
                 * Archive controls how the artifact will be saved to the artifact repository.
                 */
                archive?: /* ArchiveStrategy describes how to archive files/directory when saving artifacts */ IoArgoprojWorkflowV1alpha1ArchiveStrategy;
                /**
                 * ArchiveLogs indicates if the container logs should be archived
                 */
                archiveLogs?: boolean;
                /**
                 * ArtifactGC describes the strategy to use when to deleting an artifact from completed or deleted workflows
                 */
                artifactGC?: /* ArtifactGC describes how to delete artifacts from completed Workflows - this is embedded into the WorkflowLevelArtifactGC, and also used for individual Artifacts to override that as needed */ IoArgoprojWorkflowV1alpha1ArtifactGC;
                /**
                 * Artifactory contains artifactory artifact location details
                 */
                artifactory?: /* ArtifactoryArtifact is the location of an artifactory artifact */ IoArgoprojWorkflowV1alpha1ArtifactoryArtifact;
                /**
                 * Azure contains Azure Storage artifact location details
                 */
                azure?: /* AzureArtifact is the location of a an Azure Storage artifact */ IoArgoprojWorkflowV1alpha1AzureArtifact;
                /**
                 * Has this been deleted?
                 */
                deleted?: boolean;
                /**
                 * From allows an artifact to reference an artifact from a previous step
                 */
                from?: string;
                /**
                 * FromExpression, if defined, is evaluated to specify the value for the artifact
                 */
                fromExpression?: string;
                /**
                 * GCS contains GCS artifact location details
                 */
                gcs?: /* GCSArtifact is the location of a GCS artifact */ IoArgoprojWorkflowV1alpha1GCSArtifact;
                /**
                 * Git contains git artifact location details
                 */
                git?: /* GitArtifact is the location of an git artifact */ IoArgoprojWorkflowV1alpha1GitArtifact;
                /**
                 * GlobalName exports an output artifact to the global scope, making it available as '{{io.argoproj.workflow.v1alpha1.outputs.artifacts.XXXX}} and in workflow.status.outputs.artifacts
                 */
                globalName?: string;
                /**
                 * HDFS contains HDFS artifact location details
                 */
                hdfs?: /* HDFSArtifact is the location of an HDFS artifact */ IoArgoprojWorkflowV1alpha1HDFSArtifact;
                /**
                 * HTTP contains HTTP artifact location details
                 */
                http?: /* HTTPArtifact allows a file served on HTTP to be placed as an input artifact in a container */ IoArgoprojWorkflowV1alpha1HTTPArtifact;
                /**
                 * mode bits to use on this file, must be a value between 0 and 0777 set when loading input artifacts.
                 */
                mode?: number;
                /**
                 * name of the artifact. must be unique within a template's inputs/outputs.
                 */
                name: string;
                /**
                 * Make Artifacts optional, if Artifacts doesn't generate or exist
                 */
                optional?: boolean;
                /**
                 * OSS contains OSS artifact location details
                 */
                oss?: /* OSSArtifact is the location of an Alibaba Cloud OSS artifact */ IoArgoprojWorkflowV1alpha1OSSArtifact;
                /**
                 * Path is the container path to the artifact
                 */
                path?: string;
                /**
                 * Raw contains raw artifact location details
                 */
                raw?: /* RawArtifact allows raw string content to be placed as an artifact in a container */ IoArgoprojWorkflowV1alpha1RawArtifact;
                /**
                 * If mode is set, apply the permission recursively into the artifact if it is a folder
                 */
                recurseMode?: boolean;
                /**
                 * S3 contains S3 artifact location details
                 */
                s3?: /* S3Artifact is the location of an S3 artifact */ IoArgoprojWorkflowV1alpha1S3Artifact;
                /**
                 * SubPath allows an artifact to be sourced from a subpath within the specified source
                 */
                subPath?: string;
            }
            /**
             * ArtifactRepository represents an artifact repository in which a controller will store its artifacts
             */
            export interface IoArgoprojWorkflowV1alpha1ArtifactRepository {
                /**
                 * ArchiveLogs enables log archiving
                 */
                archiveLogs?: boolean;
                /**
                 * Artifactory stores artifacts to JFrog Artifactory
                 */
                artifactory?: /* ArtifactoryArtifactRepository defines the controller configuration for an artifactory artifact repository */ IoArgoprojWorkflowV1alpha1ArtifactoryArtifactRepository;
                /**
                 * Azure stores artifact in an Azure Storage account
                 */
                azure?: /* AzureArtifactRepository defines the controller configuration for an Azure Blob Storage artifact repository */ IoArgoprojWorkflowV1alpha1AzureArtifactRepository;
                /**
                 * GCS stores artifact in a GCS object store
                 */
                gcs?: /* GCSArtifactRepository defines the controller configuration for a GCS artifact repository */ IoArgoprojWorkflowV1alpha1GCSArtifactRepository;
                /**
                 * HDFS stores artifacts in HDFS
                 */
                hdfs?: /* HDFSArtifactRepository defines the controller configuration for an HDFS artifact repository */ IoArgoprojWorkflowV1alpha1HDFSArtifactRepository;
                /**
                 * OSS stores artifact in a OSS-compliant object store
                 */
                oss?: /* OSSArtifactRepository defines the controller configuration for an OSS artifact repository */ IoArgoprojWorkflowV1alpha1OSSArtifactRepository;
                /**
                 * S3 stores artifact in a S3-compliant object store
                 */
                s3?: /* S3ArtifactRepository defines the controller configuration for an S3 artifact repository */ IoArgoprojWorkflowV1alpha1S3ArtifactRepository;
            }
            export interface IoArgoprojWorkflowV1alpha1ArtifactRepositoryRef {
                /**
                 * The name of the config map. Defaults to "artifact-repositories".
                 */
                configMap?: string;
                /**
                 * The config map key. Defaults to the value of the "workflows.argoproj.io/default-artifact-repository" annotation.
                 */
                key?: string;
            }
            export interface IoArgoprojWorkflowV1alpha1ArtifactRepositoryRefStatus {
                /**
                 * The repository the workflow will use. This maybe empty before v3.1.
                 */
                artifactRepository?: /* ArtifactRepository represents an artifact repository in which a controller will store its artifacts */ IoArgoprojWorkflowV1alpha1ArtifactRepository;
                /**
                 * The name of the config map. Defaults to "artifact-repositories".
                 */
                configMap?: string;
                /**
                 * If this ref represents the default artifact repository, rather than a config map.
                 */
                default?: boolean;
                /**
                 * The config map key. Defaults to the value of the "workflows.argoproj.io/default-artifact-repository" annotation.
                 */
                key?: string;
                /**
                 * The namespace of the config map. Defaults to the workflow's namespace, or the controller's namespace (if found).
                 */
                namespace?: string;
            }
            /**
             * ArtifactResult describes the result of attempting to delete a given Artifact
             */
            export interface IoArgoprojWorkflowV1alpha1ArtifactResult {
                /**
                 * Error is an optional error message which should be set if Success==false
                 */
                error?: string;
                /**
                 * Name is the name of the Artifact
                 */
                name: string;
                /**
                 * Success describes whether the deletion succeeded
                 */
                success?: boolean;
            }
            /**
             * ArtifactResultNodeStatus describes the result of the deletion on a given node
             */
            export interface IoArgoprojWorkflowV1alpha1ArtifactResultNodeStatus {
                /**
                 * ArtifactResults maps Artifact name to result of the deletion
                 */
                artifactResults?: {
                    [name: string]: /* ArtifactResult describes the result of attempting to delete a given Artifact */ IoArgoprojWorkflowV1alpha1ArtifactResult;
                };
            }
            /**
             * ArtifactoryArtifact is the location of an artifactory artifact
             */
            export interface IoArgoprojWorkflowV1alpha1ArtifactoryArtifact {
                /**
                 * PasswordSecret is the secret selector to the repository password
                 */
                passwordSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * URL of the artifact
                 */
                url: string;
                /**
                 * UsernameSecret is the secret selector to the repository username
                 */
                usernameSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * ArtifactoryArtifactRepository defines the controller configuration for an artifactory artifact repository
             */
            export interface IoArgoprojWorkflowV1alpha1ArtifactoryArtifactRepository {
                /**
                 * PasswordSecret is the secret selector to the repository password
                 */
                passwordSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * RepoURL is the url for artifactory repo.
                 */
                repoURL?: string;
                /**
                 * UsernameSecret is the secret selector to the repository username
                 */
                usernameSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * AzureArtifact is the location of a an Azure Storage artifact
             */
            export interface IoArgoprojWorkflowV1alpha1AzureArtifact {
                /**
                 * AccountKeySecret is the secret selector to the Azure Blob Storage account access key
                 */
                accountKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Blob is the blob name (i.e., path) in the container where the artifact resides
                 */
                blob: string;
                /**
                 * Container is the container where resources will be stored
                 */
                container: string;
                /**
                 * Endpoint is the service url associated with an account. It is most likely "https://<ACCOUNT_NAME>.blob.core.windows.net"
                 */
                endpoint: string;
                /**
                 * UseSDKCreds tells the driver to figure out credentials based on sdk defaults.
                 */
                useSDKCreds?: boolean;
            }
            /**
             * AzureArtifactRepository defines the controller configuration for an Azure Blob Storage artifact repository
             */
            export interface IoArgoprojWorkflowV1alpha1AzureArtifactRepository {
                /**
                 * AccountKeySecret is the secret selector to the Azure Blob Storage account access key
                 */
                accountKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * BlobNameFormat is defines the format of how to store blob names. Can reference workflow variables
                 */
                blobNameFormat?: string;
                /**
                 * Container is the container where resources will be stored
                 */
                container: string;
                /**
                 * Endpoint is the service url associated with an account. It is most likely "https://<ACCOUNT_NAME>.blob.core.windows.net"
                 */
                endpoint: string;
                /**
                 * UseSDKCreds tells the driver to figure out credentials based on sdk defaults.
                 */
                useSDKCreds?: boolean;
            }
            /**
             * Backoff is a backoff strategy to use within retryStrategy
             */
            export interface IoArgoprojWorkflowV1alpha1Backoff {
                /**
                 * Duration is the amount to back off. Default unit is seconds, but could also be a duration (e.g. "2m", "1h")
                 */
                duration?: string;
                /**
                 * Factor is a factor to multiply the base duration after each failed retry
                 */
                factor?: IoK8sApimachineryPkgUtilIntstrIntOrString;
                /**
                 * MaxDuration is the maximum amount of time allowed for the backoff strategy
                 */
                maxDuration?: string;
            }
            /**
             * BasicAuth describes the secret selectors required for basic authentication
             */
            export interface IoArgoprojWorkflowV1alpha1BasicAuth {
                /**
                 * PasswordSecret is the secret selector to the repository password
                 */
                passwordSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * UsernameSecret is the secret selector to the repository username
                 */
                usernameSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * Cache is the configuration for the type of cache to be used
             */
            export interface IoArgoprojWorkflowV1alpha1Cache {
                /**
                 * ConfigMap sets a ConfigMap-based cache
                 */
                configMap: /* Selects a key from a ConfigMap. */ IoK8sApiCoreV1ConfigMapKeySelector;
            }
            /**
             * ClientCertAuth holds necessary information for client authentication via certificates
             */
            export interface IoArgoprojWorkflowV1alpha1ClientCertAuth {
                clientCertSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                clientKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * ClusterWorkflowTemplate is the definition of a workflow template resource in cluster scope
             */
            export interface IoArgoprojWorkflowV1alpha1ClusterWorkflowTemplate {
                /**
                 * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.io.k8s.community/contributors/devel/sig-architecture/api-conventions.md#resources
                 */
                apiVersion?: "argoproj.io/v1alpha1";
                /**
                 * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.io.k8s.community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
                 */
                kind?: "ClusterWorkflowTemplate";
                metadata: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                spec: /* WorkflowSpec is the specification of a Workflow. */ IoArgoprojWorkflowV1alpha1WorkflowSpec;
            }
            /**
             * Column is a custom column that will be exposed in the Workflow List View.
             */
            export interface IoArgoprojWorkflowV1alpha1Column {
                /**
                 * The key of the label or annotation, e.g., "workflows.argoproj.io/completed".
                 */
                key: string;
                /**
                 * The name of this column, e.g., "Workflow Completed".
                 */
                name: string;
                /**
                 * The type of this column, "label" or "annotation".
                 */
                type: string;
            }
            export interface IoArgoprojWorkflowV1alpha1Condition {
                /**
                 * Message is the condition message
                 */
                message?: string;
                /**
                 * Status is the status of the condition
                 */
                status?: string;
                /**
                 * Type is the type of condition
                 */
                type?: string;
            }
            export interface IoArgoprojWorkflowV1alpha1ContainerNode {
                /**
                 * Arguments to the entrypoint. The container image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
                 */
                args?: string[];
                /**
                 * Entrypoint array. Not executed within a shell. The container image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
                 */
                command?: string[];
                dependencies?: string[];
                /**
                 * List of environment variables to set in the container. Cannot be updated.
                 */
                env?: /* EnvVar represents an environment variable present in a Container. */ IoK8sApiCoreV1EnvVar[];
                /**
                 * List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.
                 */
                envFrom?: /* EnvFromSource represents the source of a set of ConfigMaps */ IoK8sApiCoreV1EnvFromSource[];
                /**
                 * Container image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.
                 */
                image?: string;
                /**
                 * Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
                 */
                imagePullPolicy?: string;
                /**
                 * Actions that the management system should take in response to container lifecycle events. Cannot be updated.
                 */
                lifecycle?: /* Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted. */ IoK8sApiCoreV1Lifecycle;
                /**
                 * Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                livenessProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.
                 */
                name: string;
                /**
                 * List of ports to expose from the container. Exposing a port here gives the system additional information about the network connections a container uses, but is primarily informational. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Cannot be updated.
                 */
                ports?: /* ContainerPort represents a network port in a single container. */ IoK8sApiCoreV1ContainerPort[];
                /**
                 * Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                readinessProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
                 */
                resources?: /* ResourceRequirements describes the compute resource requirements. */ IoK8sApiCoreV1ResourceRequirements;
                /**
                 * SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
                 */
                securityContext?: /* SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence. */ IoK8sApiCoreV1SecurityContext;
                /**
                 * StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                startupProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.
                 */
                stdin?: boolean;
                /**
                 * Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false
                 */
                stdinOnce?: boolean;
                /**
                 * Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.
                 */
                terminationMessagePath?: string;
                /**
                 * Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
                 */
                terminationMessagePolicy?: string;
                /**
                 * Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
                 */
                tty?: boolean;
                /**
                 * volumeDevices is the list of block devices to be used by the container.
                 */
                volumeDevices?: /* volumeDevice describes a mapping of a raw block device within a container. */ IoK8sApiCoreV1VolumeDevice[];
                /**
                 * Pod volumes to mount into the container's filesystem. Cannot be updated.
                 */
                volumeMounts?: /* VolumeMount describes a mounting of a Volume within a container. */ IoK8sApiCoreV1VolumeMount[];
                /**
                 * Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
                 */
                workingDir?: string;
            }
            export interface IoArgoprojWorkflowV1alpha1ContainerSetRetryStrategy {
                /**
                 * Duration is the time between each retry, examples values are "300ms", "1s" or "5m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".
                 */
                duration?: string;
                /**
                 * Nbr of retries
                 */
                retries: IoK8sApimachineryPkgUtilIntstrIntOrString;
            }
            export interface IoArgoprojWorkflowV1alpha1ContainerSetTemplate {
                containers: IoArgoprojWorkflowV1alpha1ContainerNode[];
                /**
                 * RetryStrategy describes how to retry a container nodes in the container set if it fails. Nbr of retries(default 0) and sleep duration between retries(default 0s, instant retry) can be set.
                 */
                retryStrategy?: IoArgoprojWorkflowV1alpha1ContainerSetRetryStrategy;
                volumeMounts?: /* VolumeMount describes a mounting of a Volume within a container. */ IoK8sApiCoreV1VolumeMount[];
            }
            /**
             * ContinueOn defines if a workflow should continue even if a task or step fails/errors. It can be specified if the workflow should continue when the pod errors, fails or both.
             */
            export interface IoArgoprojWorkflowV1alpha1ContinueOn {
                error?: boolean;
                failed?: boolean;
            }
            /**
             * Counter is a Counter prometheus metric
             */
            export interface IoArgoprojWorkflowV1alpha1Counter {
                /**
                 * Value is the value of the metric
                 */
                value: string;
            }
            /**
             * CreateS3BucketOptions options used to determine automatic automatic bucket-creation process
             */
            export interface IoArgoprojWorkflowV1alpha1CreateS3BucketOptions {
                /**
                 * ObjectLocking Enable object locking
                 */
                objectLocking?: boolean;
            }
            /**
             * CronWorkflow is the definition of a scheduled workflow resource
             */
            export interface IoArgoprojWorkflowV1alpha1CronWorkflow {
                /**
                 * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.io.k8s.community/contributors/devel/sig-architecture/api-conventions.md#resources
                 */
                apiVersion?: "argoproj.io/v1alpha1";
                /**
                 * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.io.k8s.community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
                 */
                kind?: "CronWorkflow";
                metadata: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                spec: /* CronWorkflowSpec is the specification of a CronWorkflow */ IoArgoprojWorkflowV1alpha1CronWorkflowSpec;
                status?: /* CronWorkflowStatus is the status of a CronWorkflow */ IoArgoprojWorkflowV1alpha1CronWorkflowStatus;
            }
            /**
             * CronWorkflowSpec is the specification of a CronWorkflow
             */
            export interface IoArgoprojWorkflowV1alpha1CronWorkflowSpec {
                /**
                 * ConcurrencyPolicy is the K8s-style concurrency policy that will be used
                 */
                concurrencyPolicy?: string;
                /**
                 * FailedJobsHistoryLimit is the number of failed jobs to be kept at a time
                 */
                failedJobsHistoryLimit?: number;
                /**
                 * Schedule is a schedule to run the Workflow in Cron format
                 */
                schedule: string;
                /**
                 * StartingDeadlineSeconds is the K8s-style deadline that will limit the time a CronWorkflow will be run after its original scheduled time if it is missed.
                 */
                startingDeadlineSeconds?: number;
                /**
                 * SuccessfulJobsHistoryLimit is the number of successful jobs to be kept at a time
                 */
                successfulJobsHistoryLimit?: number;
                /**
                 * Suspend is a flag that will stop new CronWorkflows from running if set to true
                 */
                suspend?: boolean;
                /**
                 * Timezone is the timezone against which the cron schedule will be calculated, e.g. "Asia/Tokyo". Default is machine's local time.
                 */
                timezone?: string;
                /**
                 * WorkflowMetadata contains some metadata of the workflow to be run
                 */
                workflowMetadata?: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                /**
                 * WorkflowSpec is the spec of the workflow to be run
                 */
                workflowSpec: /* WorkflowSpec is the specification of a Workflow. */ IoArgoprojWorkflowV1alpha1WorkflowSpec;
            }
            /**
             * CronWorkflowStatus is the status of a CronWorkflow
             */
            export interface IoArgoprojWorkflowV1alpha1CronWorkflowStatus {
                /**
                 * Active is a list of active workflows stemming from this CronWorkflow
                 */
                active: /* ObjectReference contains enough information to let you inspect or modify the referred object. */ IoK8sApiCoreV1ObjectReference[];
                /**
                 * Conditions is a list of conditions the CronWorkflow may have
                 */
                conditions: IoArgoprojWorkflowV1alpha1Condition[];
                /**
                 * LastScheduleTime is the last time the CronWorkflow was scheduled
                 */
                lastScheduledTime: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
            }
            /**
             * DAGTask represents a node in the graph during DAG execution
             */
            export interface IoArgoprojWorkflowV1alpha1DAGTask {
                /**
                 * Arguments are the parameter and artifact arguments to the template
                 */
                arguments?: /* Arguments to a template */ IoArgoprojWorkflowV1alpha1Arguments;
                /**
                 * ContinueOn makes argo to proceed with the following step even if this step fails. Errors and Failed states can be specified
                 */
                continueOn?: /* ContinueOn defines if a workflow should continue even if a task or step fails/errors. It can be specified if the workflow should continue when the pod errors, fails or both. */ IoArgoprojWorkflowV1alpha1ContinueOn;
                /**
                 * Dependencies are name of other targets which this depends on
                 */
                dependencies?: string[];
                /**
                 * Depends are name of other targets which this depends on
                 */
                depends?: string;
                /**
                 * Hooks hold the lifecycle hook which is invoked at lifecycle of task, irrespective of the success, failure, or error status of the primary task
                 */
                hooks?: {
                    [name: string]: IoArgoprojWorkflowV1alpha1LifecycleHook;
                };
                /**
                 * Inline is the template. Template must be empty if this is declared (and vice-versa).
                 */
                inline?: /* Template is a reusable and composable unit of execution in a workflow */ IoArgoprojWorkflowV1alpha1Template;
                /**
                 * Name is the name of the target
                 */
                name: string;
                /**
                 * OnExit is a template reference which is invoked at the end of the template, irrespective of the success, failure, or error of the primary template. DEPRECATED: Use Hooks[exit].Template instead.
                 */
                onExit?: string;
                /**
                 * Name of template to execute
                 */
                template?: string;
                /**
                 * TemplateRef is the reference to the template resource to execute.
                 */
                templateRef?: /* TemplateRef is a reference of template resource. */ IoArgoprojWorkflowV1alpha1TemplateRef;
                /**
                 * When is an expression in which the task should conditionally execute
                 */
                when?: string;
                /**
                 * WithItems expands a task into multiple parallel tasks from the items in the list
                 */
                withItems?: /* Item expands a single workflow step into multiple parallel steps The value of Item can be a map, string, bool, or number */ IoArgoprojWorkflowV1alpha1Item[];
                /**
                 * WithParam expands a task into multiple parallel tasks from the value in the parameter, which is expected to be a JSON list.
                 */
                withParam?: string;
                /**
                 * WithSequence expands a task into a numeric sequence
                 */
                withSequence?: /* Sequence expands a workflow step into numeric range */ IoArgoprojWorkflowV1alpha1Sequence;
            }
            /**
             * DAGTemplate is a template subtype for directed acyclic graph templates
             */
            export interface IoArgoprojWorkflowV1alpha1DAGTemplate {
                /**
                 * This flag is for DAG logic. The DAG logic has a built-in "fail fast" feature to stop scheduling new steps, as soon as it detects that one of the DAG nodes is failed. Then it waits until all DAG nodes are completed before failing the DAG itself. The FailFast flag default is true,  if set to false, it will allow a DAG to run all branches of the DAG to completion (either success or failure), regardless of the failed outcomes of branches in the DAG. More info and example about this feature at https://github.com/argoproj/argo-workflows/issues/1442
                 */
                failFast?: boolean;
                /**
                 * Target are one or more names of targets to execute in a DAG
                 */
                target?: string;
                /**
                 * Tasks are a list of DAG tasks
                 */
                tasks: /* DAGTask represents a node in the graph during DAG execution */ IoArgoprojWorkflowV1alpha1DAGTask[];
            }
            /**
             * Data is a data template
             */
            export interface IoArgoprojWorkflowV1alpha1Data {
                /**
                 * Source sources external data into a data template
                 */
                source: /* DataSource sources external data into a data template */ IoArgoprojWorkflowV1alpha1DataSource;
                /**
                 * Transformation applies a set of transformations
                 */
                transformation: IoArgoprojWorkflowV1alpha1TransformationStep[];
            }
            /**
             * DataSource sources external data into a data template
             */
            export interface IoArgoprojWorkflowV1alpha1DataSource {
                /**
                 * ArtifactPaths is a data transformation that collects a list of artifact paths
                 */
                artifactPaths?: /* ArtifactPaths expands a step from a collection of artifacts */ IoArgoprojWorkflowV1alpha1ArtifactPaths;
            }
            export interface IoArgoprojWorkflowV1alpha1Event {
                /**
                 * Selector (https://github.com/antonmedv/expr) that we must must match the io.argoproj.workflow.v1alpha1. E.g. `payload.message == "test"`
                 */
                selector: string;
            }
            /**
             * ExecutorConfig holds configurations of an executor container.
             */
            export interface IoArgoprojWorkflowV1alpha1ExecutorConfig {
                /**
                 * ServiceAccountName specifies the service account name of the executor container.
                 */
                serviceAccountName?: string;
            }
            /**
             * GCSArtifact is the location of a GCS artifact
             */
            export interface IoArgoprojWorkflowV1alpha1GCSArtifact {
                /**
                 * Bucket is the name of the bucket
                 */
                bucket?: string;
                /**
                 * Key is the path in the bucket where the artifact resides
                 */
                key: string;
                /**
                 * ServiceAccountKeySecret is the secret selector to the bucket's service account key
                 */
                serviceAccountKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * GCSArtifactRepository defines the controller configuration for a GCS artifact repository
             */
            export interface IoArgoprojWorkflowV1alpha1GCSArtifactRepository {
                /**
                 * Bucket is the name of the bucket
                 */
                bucket?: string;
                /**
                 * KeyFormat is defines the format of how to store keys. Can reference workflow variables
                 */
                keyFormat?: string;
                /**
                 * ServiceAccountKeySecret is the secret selector to the bucket's service account key
                 */
                serviceAccountKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * Gauge is a Gauge prometheus metric
             */
            export interface IoArgoprojWorkflowV1alpha1Gauge {
                /**
                 * Operation defines the operation to apply with value and the metrics' current value
                 */
                operation?: string;
                /**
                 * Realtime emits this metric in real time if applicable
                 */
                realtime: boolean;
                /**
                 * Value is the value to be used in the operation with the metric's current value. If no operation is set, value is the value of the metric
                 */
                value: string;
            }
            /**
             * GitArtifact is the location of an git artifact
             */
            export interface IoArgoprojWorkflowV1alpha1GitArtifact {
                /**
                 * Branch is the branch to fetch when `SingleBranch` is enabled
                 */
                branch?: string;
                /**
                 * Depth specifies clones/fetches should be shallow and include the given number of commits from the branch tip
                 */
                depth?: number;
                /**
                 * DisableSubmodules disables submodules during git clone
                 */
                disableSubmodules?: boolean;
                /**
                 * Fetch specifies a number of refs that should be fetched before checkout
                 */
                fetch?: string[];
                /**
                 * InsecureIgnoreHostKey disables SSH strict host key checking during git clone
                 */
                insecureIgnoreHostKey?: boolean;
                /**
                 * PasswordSecret is the secret selector to the repository password
                 */
                passwordSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Repo is the git repository
                 */
                repo: string;
                /**
                 * Revision is the git commit, tag, branch to checkout
                 */
                revision?: string;
                /**
                 * SingleBranch enables single branch clone, using the `branch` parameter
                 */
                singleBranch?: boolean;
                /**
                 * SSHPrivateKeySecret is the secret selector to the repository ssh private key
                 */
                sshPrivateKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * UsernameSecret is the secret selector to the repository username
                 */
                usernameSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * HDFSArtifact is the location of an HDFS artifact
             */
            export interface IoArgoprojWorkflowV1alpha1HDFSArtifact {
                /**
                 * Addresses is accessible addresses of HDFS name nodes
                 */
                addresses?: string[];
                /**
                 * Force copies a file forcibly even if it exists
                 */
                force?: boolean;
                /**
                 * HDFSUser is the user to access HDFS file system. It is ignored if either ccache or keytab is used.
                 */
                hdfsUser?: string;
                /**
                 * KrbCCacheSecret is the secret selector for Kerberos ccache Either ccache or keytab can be set to use Kerberos.
                 */
                krbCCacheSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * KrbConfig is the configmap selector for Kerberos config as string It must be set if either ccache or keytab is used.
                 */
                krbConfigConfigMap?: /* Selects a key from a ConfigMap. */ IoK8sApiCoreV1ConfigMapKeySelector;
                /**
                 * KrbKeytabSecret is the secret selector for Kerberos keytab Either ccache or keytab can be set to use Kerberos.
                 */
                krbKeytabSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * KrbRealm is the Kerberos realm used with Kerberos keytab It must be set if keytab is used.
                 */
                krbRealm?: string;
                /**
                 * KrbServicePrincipalName is the principal name of Kerberos service It must be set if either ccache or keytab is used.
                 */
                krbServicePrincipalName?: string;
                /**
                 * KrbUsername is the Kerberos username used with Kerberos keytab It must be set if keytab is used.
                 */
                krbUsername?: string;
                /**
                 * Path is a file path in HDFS
                 */
                path: string;
            }
            /**
             * HDFSArtifactRepository defines the controller configuration for an HDFS artifact repository
             */
            export interface IoArgoprojWorkflowV1alpha1HDFSArtifactRepository {
                /**
                 * Addresses is accessible addresses of HDFS name nodes
                 */
                addresses?: string[];
                /**
                 * Force copies a file forcibly even if it exists
                 */
                force?: boolean;
                /**
                 * HDFSUser is the user to access HDFS file system. It is ignored if either ccache or keytab is used.
                 */
                hdfsUser?: string;
                /**
                 * KrbCCacheSecret is the secret selector for Kerberos ccache Either ccache or keytab can be set to use Kerberos.
                 */
                krbCCacheSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * KrbConfig is the configmap selector for Kerberos config as string It must be set if either ccache or keytab is used.
                 */
                krbConfigConfigMap?: /* Selects a key from a ConfigMap. */ IoK8sApiCoreV1ConfigMapKeySelector;
                /**
                 * KrbKeytabSecret is the secret selector for Kerberos keytab Either ccache or keytab can be set to use Kerberos.
                 */
                krbKeytabSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * KrbRealm is the Kerberos realm used with Kerberos keytab It must be set if keytab is used.
                 */
                krbRealm?: string;
                /**
                 * KrbServicePrincipalName is the principal name of Kerberos service It must be set if either ccache or keytab is used.
                 */
                krbServicePrincipalName?: string;
                /**
                 * KrbUsername is the Kerberos username used with Kerberos keytab It must be set if keytab is used.
                 */
                krbUsername?: string;
                /**
                 * PathFormat is defines the format of path to store a file. Can reference workflow variables
                 */
                pathFormat?: string;
            }
            export interface IoArgoprojWorkflowV1alpha1HTTP {
                /**
                 * Body is content of the HTTP Request
                 */
                body?: string;
                /**
                 * BodyFrom is  content of the HTTP Request as Bytes
                 */
                bodyFrom?: /* HTTPBodySource contains the source of the HTTP body. */ IoArgoprojWorkflowV1alpha1HTTPBodySource;
                /**
                 * Headers are an optional list of headers to send with HTTP requests
                 */
                headers?: IoArgoprojWorkflowV1alpha1HTTPHeader[];
                /**
                 * InsecureSkipVerify is a bool when if set to true will skip TLS verification for the HTTP client
                 */
                insecureSkipVerify?: boolean;
                /**
                 * Method is HTTP methods for HTTP Request
                 */
                method?: string;
                /**
                 * SuccessCondition is an expression if evaluated to true is considered successful
                 */
                successCondition?: string;
                /**
                 * TimeoutSeconds is request timeout for HTTP Request. Default is 30 seconds
                 */
                timeoutSeconds?: number;
                /**
                 * URL of the HTTP Request
                 */
                url: string;
            }
            /**
             * HTTPArtifact allows a file served on HTTP to be placed as an input artifact in a container
             */
            export interface IoArgoprojWorkflowV1alpha1HTTPArtifact {
                /**
                 * Auth contains information for client authentication
                 */
                auth?: IoArgoprojWorkflowV1alpha1HTTPAuth;
                /**
                 * Headers are an optional list of headers to send with HTTP requests for artifacts
                 */
                headers?: /* Header indicate a key-value request header to be used when fetching artifacts over HTTP */ IoArgoprojWorkflowV1alpha1Header[];
                /**
                 * URL of the artifact
                 */
                url: string;
            }
            export interface IoArgoprojWorkflowV1alpha1HTTPAuth {
                basicAuth?: /* BasicAuth describes the secret selectors required for basic authentication */ IoArgoprojWorkflowV1alpha1BasicAuth;
                clientCert?: /* ClientCertAuth holds necessary information for client authentication via certificates */ IoArgoprojWorkflowV1alpha1ClientCertAuth;
                oauth2?: /* OAuth2Auth holds all information for client authentication via OAuth2 tokens */ IoArgoprojWorkflowV1alpha1OAuth2Auth;
            }
            /**
             * HTTPBodySource contains the source of the HTTP body.
             */
            export interface IoArgoprojWorkflowV1alpha1HTTPBodySource {
                bytes?: string; // byte
            }
            export interface IoArgoprojWorkflowV1alpha1HTTPHeader {
                name: string;
                value?: string;
                valueFrom?: IoArgoprojWorkflowV1alpha1HTTPHeaderSource;
            }
            export interface IoArgoprojWorkflowV1alpha1HTTPHeaderSource {
                secretKeyRef?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * Header indicate a key-value request header to be used when fetching artifacts over HTTP
             */
            export interface IoArgoprojWorkflowV1alpha1Header {
                /**
                 * Name is the header name
                 */
                name: string;
                /**
                 * Value is the literal value to use for the header
                 */
                value: string;
            }
            /**
             * Histogram is a Histogram prometheus metric
             */
            export interface IoArgoprojWorkflowV1alpha1Histogram {
                /**
                 * Buckets is a list of bucket divisors for the histogram
                 */
                buckets: /* Amount represent a numeric amount. */ IoArgoprojWorkflowV1alpha1Amount[];
                /**
                 * Value is the value of the metric
                 */
                value: string;
            }
            /**
             * Inputs are the mechanism for passing parameters, artifacts, volumes from one template to another
             */
            export interface IoArgoprojWorkflowV1alpha1Inputs {
                /**
                 * Artifact are a list of artifacts passed as inputs
                 */
                artifacts?: /* Artifact indicates an artifact to place at a specified path */ IoArgoprojWorkflowV1alpha1Artifact[];
                /**
                 * Parameters are a list of parameters passed as inputs
                 */
                parameters?: /* Parameter indicate a passed string parameter to a service template with an optional default value */ IoArgoprojWorkflowV1alpha1Parameter[];
            }
            /**
             * Item expands a single workflow step into multiple parallel steps The value of Item can be a map, string, bool, or number
             */
            export type IoArgoprojWorkflowV1alpha1Item = any;
            export interface IoArgoprojWorkflowV1alpha1LabelValueFrom {
                expression: string;
            }
            export interface IoArgoprojWorkflowV1alpha1LifecycleHook {
                /**
                 * Arguments hold arguments to the template
                 */
                arguments?: /* Arguments to a template */ IoArgoprojWorkflowV1alpha1Arguments;
                /**
                 * Expression is a condition expression for when a node will be retried. If it evaluates to false, the node will not be retried and the retry strategy will be ignored
                 */
                expression?: string;
                /**
                 * Template is the name of the template to execute by the hook
                 */
                template?: string;
                /**
                 * TemplateRef is the reference to the template resource to execute by the hook
                 */
                templateRef?: /* TemplateRef is a reference of template resource. */ IoArgoprojWorkflowV1alpha1TemplateRef;
            }
            /**
             * A link to another app.
             */
            export interface IoArgoprojWorkflowV1alpha1Link {
                /**
                 * The name of the link, E.g. "Workflow Logs" or "Pod Logs"
                 */
                name: string;
                /**
                 * "workflow", "pod", "pod-logs", "event-source-logs", "sensor-logs", "workflow-list" or "chat"
                 */
                scope: string;
                /**
                 * The URL. Can contain "${metadata.namespace}", "${metadata.name}", "${status.startedAt}", "${status.finishedAt}" or any other element in workflow yaml, e.g. "${io.argoproj.workflow.v1alpha1.metadata.annotations.userDefinedKey}"
                 */
                url: string;
            }
            export interface IoArgoprojWorkflowV1alpha1ManifestFrom {
                /**
                 * Artifact contains the artifact to use
                 */
                artifact: /* Artifact indicates an artifact to place at a specified path */ IoArgoprojWorkflowV1alpha1Artifact;
            }
            /**
             * MemoizationStatus is the status of this memoized node
             */
            export interface IoArgoprojWorkflowV1alpha1MemoizationStatus {
                /**
                 * Cache is the name of the cache that was used
                 */
                cacheName: string;
                /**
                 * Hit indicates whether this node was created from a cache entry
                 */
                hit: boolean;
                /**
                 * Key is the name of the key used for this node's cache
                 */
                key: string;
            }
            /**
             * Memoization enables caching for the Outputs of the template
             */
            export interface IoArgoprojWorkflowV1alpha1Memoize {
                /**
                 * Cache sets and configures the kind of cache
                 */
                cache: /* Cache is the configuration for the type of cache to be used */ IoArgoprojWorkflowV1alpha1Cache;
                /**
                 * Key is the key to use as the caching key
                 */
                key: string;
                /**
                 * MaxAge is the maximum age (e.g. "180s", "24h") of an entry that is still considered valid. If an entry is older than the MaxAge, it will be ignored.
                 */
                maxAge: string;
            }
            /**
             * Pod metdata
             */
            export interface IoArgoprojWorkflowV1alpha1Metadata {
                annotations?: {
                    [name: string]: string;
                };
                labels?: {
                    [name: string]: string;
                };
            }
            /**
             * MetricLabel is a single label for a prometheus metric
             */
            export interface IoArgoprojWorkflowV1alpha1MetricLabel {
                key: string;
                value: string;
            }
            /**
             * Metrics are a list of metrics emitted from a Workflow/Template
             */
            export interface IoArgoprojWorkflowV1alpha1Metrics {
                /**
                 * Prometheus is a list of prometheus metrics to be emitted
                 */
                prometheus: /* Prometheus is a prometheus metric to be emitted */ IoArgoprojWorkflowV1alpha1Prometheus[];
            }
            /**
             * Mutex holds Mutex configuration
             */
            export interface IoArgoprojWorkflowV1alpha1Mutex {
                /**
                 * name of the mutex
                 */
                name?: string;
            }
            /**
             * MutexHolding describes the mutex and the object which is holding it.
             */
            export interface IoArgoprojWorkflowV1alpha1MutexHolding {
                /**
                 * Holder is a reference to the object which holds the Mutex. Holding Scenario:
                 *   1. Current workflow's NodeID which is holding the lock.
                 *      e.g: ${NodeID}
                 * Waiting Scenario:
                 *   1. Current workflow or other workflow NodeID which is holding the lock.
                 *      e.g: ${WorkflowName}/${NodeID}
                 */
                holder?: string;
                /**
                 * Reference for the mutex e.g: ${namespace}/mutex/${mutexName}
                 */
                mutex?: string;
            }
            /**
             * MutexStatus contains which objects hold  mutex locks, and which objects this workflow is waiting on to release locks.
             */
            export interface IoArgoprojWorkflowV1alpha1MutexStatus {
                /**
                 * Holding is a list of mutexes and their respective objects that are held by mutex lock for this io.argoproj.workflow.v1alpha1.
                 */
                holding?: /* MutexHolding describes the mutex and the object which is holding it. */ IoArgoprojWorkflowV1alpha1MutexHolding[];
                /**
                 * Waiting is a list of mutexes and their respective objects this workflow is waiting for.
                 */
                waiting?: /* MutexHolding describes the mutex and the object which is holding it. */ IoArgoprojWorkflowV1alpha1MutexHolding[];
            }
            export interface IoArgoprojWorkflowV1alpha1NodeResult {
                message?: string;
                outputs?: /* Outputs hold parameters, artifacts, and results from a step */ IoArgoprojWorkflowV1alpha1Outputs;
                phase?: string;
                progress?: string;
            }
            /**
             * NodeStatus contains status information about an individual node in the workflow
             */
            export interface IoArgoprojWorkflowV1alpha1NodeStatus {
                /**
                 * BoundaryID indicates the node ID of the associated template root node in which this node belongs to
                 */
                boundaryID?: string;
                /**
                 * Children is a list of child node IDs
                 */
                children?: string[];
                /**
                 * Daemoned tracks whether or not this node was daemoned and need to be terminated
                 */
                daemoned?: boolean;
                /**
                 * DisplayName is a human readable representation of the node. Unique within a template boundary
                 */
                displayName?: string;
                /**
                 * EstimatedDuration in seconds.
                 */
                estimatedDuration?: number;
                /**
                 * Time at which this node completed
                 */
                finishedAt?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * HostNodeName name of the Kubernetes node on which the Pod is running, if applicable
                 */
                hostNodeName?: string;
                /**
                 * ID is a unique identifier of a node within the worklow It is implemented as a hash of the node name, which makes the ID deterministic
                 */
                id: string;
                /**
                 * Inputs captures input parameter values and artifact locations supplied to this template invocation
                 */
                inputs?: /* Inputs are the mechanism for passing parameters, artifacts, volumes from one template to another */ IoArgoprojWorkflowV1alpha1Inputs;
                /**
                 * MemoizationStatus holds information about cached nodes
                 */
                memoizationStatus?: /* MemoizationStatus is the status of this memoized node */ IoArgoprojWorkflowV1alpha1MemoizationStatus;
                /**
                 * A human readable message indicating details about why the node is in this condition.
                 */
                message?: string;
                /**
                 * Name is unique name in the node tree used to generate the node ID
                 */
                name: string;
                /**
                 * OutboundNodes tracks the node IDs which are considered "outbound" nodes to a template invocation. For every invocation of a template, there are nodes which we considered as "outbound". Essentially, these are last nodes in the execution sequence to run, before the template is considered completed. These nodes are then connected as parents to a following step.
                 *
                 * In the case of single pod steps (i.e. container, script, resource templates), this list will be nil since the pod itself is already considered the "outbound" node. In the case of DAGs, outbound nodes are the "target" tasks (tasks with no children). In the case of steps, outbound nodes are all the containers involved in the last step group. NOTE: since templates are composable, the list of outbound nodes are carried upwards when a DAG/steps template invokes another DAG/steps template. In other words, the outbound nodes of a template, will be a superset of the outbound nodes of its last children.
                 */
                outboundNodes?: string[];
                /**
                 * Outputs captures output parameter values and artifact locations produced by this template invocation
                 */
                outputs?: /* Outputs hold parameters, artifacts, and results from a step */ IoArgoprojWorkflowV1alpha1Outputs;
                /**
                 * Phase a simple, high-level summary of where the node is in its lifecycle. Can be used as a state machine. Will be one of these values "Pending", "Running" before the node is completed, or "Succeeded", "Skipped", "Failed", "Error", or "Omitted" as a final state.
                 */
                phase?: string;
                /**
                 * PodIP captures the IP of the pod for daemoned steps
                 */
                podIP?: string;
                /**
                 * Progress to completion
                 */
                progress?: string;
                /**
                 * ResourcesDuration is indicative, but not accurate, resource duration. This is populated when the nodes completes.
                 */
                resourcesDuration?: {
                    [name: string]: number; // int64
                };
                /**
                 * Time at which this node started
                 */
                startedAt?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * SynchronizationStatus is the synchronization status of the node
                 */
                synchronizationStatus?: /* NodeSynchronizationStatus stores the status of a node */ IoArgoprojWorkflowV1alpha1NodeSynchronizationStatus;
                /**
                 * TemplateName is the template name which this node corresponds to. Not applicable to virtual nodes (e.g. Retry, StepGroup)
                 */
                templateName?: string;
                /**
                 * TemplateRef is the reference to the template resource which this node corresponds to. Not applicable to virtual nodes (e.g. Retry, StepGroup)
                 */
                templateRef?: /* TemplateRef is a reference of template resource. */ IoArgoprojWorkflowV1alpha1TemplateRef;
                /**
                 * TemplateScope is the template scope in which the template of this node was retrieved.
                 */
                templateScope?: string;
                /**
                 * Type indicates type of node
                 */
                type: string;
            }
            /**
             * NodeSynchronizationStatus stores the status of a node
             */
            export interface IoArgoprojWorkflowV1alpha1NodeSynchronizationStatus {
                /**
                 * Waiting is the name of the lock that this node is waiting for
                 */
                waiting?: string;
            }
            /**
             * NoneStrategy indicates to skip tar process and upload the files or directory tree as independent files. Note that if the artifact is a directory, the artifact driver must support the ability to save/load the directory appropriately.
             */
            export interface IoArgoprojWorkflowV1alpha1NoneStrategy {
            }
            /**
             * OAuth2Auth holds all information for client authentication via OAuth2 tokens
             */
            export interface IoArgoprojWorkflowV1alpha1OAuth2Auth {
                clientIDSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                clientSecretSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                endpointParams?: /* EndpointParam is for requesting optional fields that should be sent in the oauth request */ IoArgoprojWorkflowV1alpha1OAuth2EndpointParam[];
                scopes?: string[];
                tokenURLSecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * EndpointParam is for requesting optional fields that should be sent in the oauth request
             */
            export interface IoArgoprojWorkflowV1alpha1OAuth2EndpointParam {
                /**
                 * Name is the header name
                 */
                key: string;
                /**
                 * Value is the literal value to use for the header
                 */
                value?: string;
            }
            /**
             * OSSArtifact is the location of an Alibaba Cloud OSS artifact
             */
            export interface IoArgoprojWorkflowV1alpha1OSSArtifact {
                /**
                 * AccessKeySecret is the secret selector to the bucket's access key
                 */
                accessKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Bucket is the name of the bucket
                 */
                bucket?: string;
                /**
                 * CreateBucketIfNotPresent tells the driver to attempt to create the OSS bucket for output artifacts, if it doesn't exist
                 */
                createBucketIfNotPresent?: boolean;
                /**
                 * Endpoint is the hostname of the bucket endpoint
                 */
                endpoint?: string;
                /**
                 * Key is the path in the bucket where the artifact resides
                 */
                key: string;
                /**
                 * LifecycleRule specifies how to manage bucket's lifecycle
                 */
                lifecycleRule?: /* OSSLifecycleRule specifies how to manage bucket's lifecycle */ IoArgoprojWorkflowV1alpha1OSSLifecycleRule;
                /**
                 * SecretKeySecret is the secret selector to the bucket's secret key
                 */
                secretKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * SecurityToken is the user's temporary security token. For more details, check out: https://www.alibabacloud.com/help/doc-detail/100624.htm
                 */
                securityToken?: string;
            }
            /**
             * OSSArtifactRepository defines the controller configuration for an OSS artifact repository
             */
            export interface IoArgoprojWorkflowV1alpha1OSSArtifactRepository {
                /**
                 * AccessKeySecret is the secret selector to the bucket's access key
                 */
                accessKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Bucket is the name of the bucket
                 */
                bucket?: string;
                /**
                 * CreateBucketIfNotPresent tells the driver to attempt to create the OSS bucket for output artifacts, if it doesn't exist
                 */
                createBucketIfNotPresent?: boolean;
                /**
                 * Endpoint is the hostname of the bucket endpoint
                 */
                endpoint?: string;
                /**
                 * KeyFormat is defines the format of how to store keys. Can reference workflow variables
                 */
                keyFormat?: string;
                /**
                 * LifecycleRule specifies how to manage bucket's lifecycle
                 */
                lifecycleRule?: /* OSSLifecycleRule specifies how to manage bucket's lifecycle */ IoArgoprojWorkflowV1alpha1OSSLifecycleRule;
                /**
                 * SecretKeySecret is the secret selector to the bucket's secret key
                 */
                secretKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * SecurityToken is the user's temporary security token. For more details, check out: https://www.alibabacloud.com/help/doc-detail/100624.htm
                 */
                securityToken?: string;
            }
            /**
             * OSSLifecycleRule specifies how to manage bucket's lifecycle
             */
            export interface IoArgoprojWorkflowV1alpha1OSSLifecycleRule {
                /**
                 * MarkDeletionAfterDays is the number of days before we delete objects in the bucket
                 */
                markDeletionAfterDays?: number;
                /**
                 * MarkInfrequentAccessAfterDays is the number of days before we convert the objects in the bucket to Infrequent Access (IA) storage type
                 */
                markInfrequentAccessAfterDays?: number;
            }
            /**
             * Outputs hold parameters, artifacts, and results from a step
             */
            export interface IoArgoprojWorkflowV1alpha1Outputs {
                /**
                 * Artifacts holds the list of output artifacts produced by a step
                 */
                artifacts?: /* Artifact indicates an artifact to place at a specified path */ IoArgoprojWorkflowV1alpha1Artifact[];
                /**
                 * ExitCode holds the exit code of a script template
                 */
                exitCode?: string;
                /**
                 * Parameters holds the list of output parameters produced by a step
                 */
                parameters?: /* Parameter indicate a passed string parameter to a service template with an optional default value */ IoArgoprojWorkflowV1alpha1Parameter[];
                /**
                 * Result holds the result (stdout) of a script template
                 */
                result?: string;
            }
            export type IoArgoprojWorkflowV1alpha1ParallelSteps = /* WorkflowStep is a reference to a template to execute in a series of step */ IoArgoprojWorkflowV1alpha1WorkflowStep[];
            /**
             * Parameter indicate a passed string parameter to a service template with an optional default value
             */
            export interface IoArgoprojWorkflowV1alpha1Parameter {
                /**
                 * Default is the default value to use for an input parameter if a value was not supplied
                 */
                default?: string;
                /**
                 * Description is the parameter description
                 */
                description?: string;
                /**
                 * Enum holds a list of string values to choose from, for the actual value of the parameter
                 */
                enum?: string[];
                /**
                 * GlobalName exports an output parameter to the global scope, making it available as '{{io.argoproj.workflow.v1alpha1.outputs.parameters.XXXX}} and in workflow.status.outputs.parameters
                 */
                globalName?: string;
                /**
                 * Name is the parameter name
                 */
                name: string;
                /**
                 * Value is the literal value to use for the parameter. If specified in the context of an input parameter, the value takes precedence over any passed values
                 */
                value?: string;
                /**
                 * ValueFrom is the source for the output parameter's value
                 */
                valueFrom?: /* ValueFrom describes a location in which to obtain the value to a parameter */ IoArgoprojWorkflowV1alpha1ValueFrom;
            }
            /**
             * Plugin is an Object with exactly one key
             */
            export interface IoArgoprojWorkflowV1alpha1Plugin {
            }
            /**
             * PodGC describes how to delete completed pods as they complete
             */
            export interface IoArgoprojWorkflowV1alpha1PodGC {
                /**
                 * LabelSelector is the label selector to check if the pods match the labels before being added to the pod GC queue.
                 */
                labelSelector?: /* A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects. */ IoK8sApimachineryPkgApisMetaV1LabelSelector;
                /**
                 * Strategy is the strategy to use. One of "OnPodCompletion", "OnPodSuccess", "OnWorkflowCompletion", "OnWorkflowSuccess"
                 */
                strategy?: string;
            }
            /**
             * Prometheus is a prometheus metric to be emitted
             */
            export interface IoArgoprojWorkflowV1alpha1Prometheus {
                /**
                 * Counter is a counter metric
                 */
                counter?: /* Counter is a Counter prometheus metric */ IoArgoprojWorkflowV1alpha1Counter;
                /**
                 * Gauge is a gauge metric
                 */
                gauge?: /* Gauge is a Gauge prometheus metric */ IoArgoprojWorkflowV1alpha1Gauge;
                /**
                 * Help is a string that describes the metric
                 */
                help: string;
                /**
                 * Histogram is a histogram metric
                 */
                histogram?: /* Histogram is a Histogram prometheus metric */ IoArgoprojWorkflowV1alpha1Histogram;
                /**
                 * Labels is a list of metric labels
                 */
                labels?: /* MetricLabel is a single label for a prometheus metric */ IoArgoprojWorkflowV1alpha1MetricLabel[];
                /**
                 * Name is the name of the metric
                 */
                name: string;
                /**
                 * When is a conditional statement that decides when to emit the metric
                 */
                when?: string;
            }
            /**
             * RawArtifact allows raw string content to be placed as an artifact in a container
             */
            export interface IoArgoprojWorkflowV1alpha1RawArtifact {
                /**
                 * Data is the string contents of the artifact
                 */
                data: string;
            }
            /**
             * ResourceTemplate is a template subtype to manipulate kubernetes resources
             */
            export interface IoArgoprojWorkflowV1alpha1ResourceTemplate {
                /**
                 * Action is the action to perform to the resource. Must be one of: get, create, apply, delete, replace, patch
                 */
                action: string;
                /**
                 * FailureCondition is a label selector expression which describes the conditions of the k8s resource in which the step was considered failed
                 */
                failureCondition?: string;
                /**
                 * Flags is a set of additional options passed to kubectl before submitting a resource I.e. to disable resource validation: flags: [
                 * 	"--validate=false"  # disable resource validation
                 * ]
                 */
                flags?: string[];
                /**
                 * Manifest contains the kubernetes manifest
                 */
                manifest?: string;
                /**
                 * ManifestFrom is the source for a single kubernetes manifest
                 */
                manifestFrom?: IoArgoprojWorkflowV1alpha1ManifestFrom;
                /**
                 * MergeStrategy is the strategy used to merge a patch. It defaults to "strategic" Must be one of: strategic, merge, json
                 */
                mergeStrategy?: string;
                /**
                 * SetOwnerReference sets the reference to the workflow on the OwnerReference of generated resource.
                 */
                setOwnerReference?: boolean;
                /**
                 * SuccessCondition is a label selector expression which describes the conditions of the k8s resource in which it is acceptable to proceed to the following step
                 */
                successCondition?: string;
            }
            /**
             * RetryAffinity prevents running steps on the same host.
             */
            export interface IoArgoprojWorkflowV1alpha1RetryAffinity {
                nodeAntiAffinity?: /* RetryNodeAntiAffinity is a placeholder for future expansion, only empty nodeAntiAffinity is allowed. In order to prevent running steps on the same host, it uses "kubernetes.io/hostname". */ IoArgoprojWorkflowV1alpha1RetryNodeAntiAffinity;
            }
            /**
             * RetryNodeAntiAffinity is a placeholder for future expansion, only empty nodeAntiAffinity is allowed. In order to prevent running steps on the same host, it uses "kubernetes.io/hostname".
             */
            export interface IoArgoprojWorkflowV1alpha1RetryNodeAntiAffinity {
            }
            /**
             * RetryStrategy provides controls on how to retry a workflow step
             */
            export interface IoArgoprojWorkflowV1alpha1RetryStrategy {
                /**
                 * Affinity prevents running workflow's step on the same host
                 */
                affinity?: /* RetryAffinity prevents running steps on the same host. */ IoArgoprojWorkflowV1alpha1RetryAffinity;
                /**
                 * Backoff is a backoff strategy
                 */
                backoff?: /* Backoff is a backoff strategy to use within retryStrategy */ IoArgoprojWorkflowV1alpha1Backoff;
                /**
                 * Expression is a condition expression for when a node will be retried. If it evaluates to false, the node will not be retried and the retry strategy will be ignored
                 */
                expression?: string;
                /**
                 * Limit is the maximum number of retry attempts when retrying a container. It does not include the original container; the maximum number of total attempts will be `limit + 1`.
                 */
                limit?: IoK8sApimachineryPkgUtilIntstrIntOrString;
                /**
                 * RetryPolicy is a policy of NodePhase statuses that will be retried
                 */
                retryPolicy?: string;
            }
            /**
             * S3Artifact is the location of an S3 artifact
             */
            export interface IoArgoprojWorkflowV1alpha1S3Artifact {
                /**
                 * AccessKeySecret is the secret selector to the bucket's access key
                 */
                accessKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Bucket is the name of the bucket
                 */
                bucket?: string;
                /**
                 * CreateBucketIfNotPresent tells the driver to attempt to create the S3 bucket for output artifacts, if it doesn't exist. Setting Enabled Encryption will apply either SSE-S3 to the bucket if KmsKeyId is not set or SSE-KMS if it is.
                 */
                createBucketIfNotPresent?: /* CreateS3BucketOptions options used to determine automatic automatic bucket-creation process */ IoArgoprojWorkflowV1alpha1CreateS3BucketOptions;
                encryptionOptions?: /* S3EncryptionOptions used to determine encryption options during s3 operations */ IoArgoprojWorkflowV1alpha1S3EncryptionOptions;
                /**
                 * Endpoint is the hostname of the bucket endpoint
                 */
                endpoint?: string;
                /**
                 * Insecure will connect to the service with TLS
                 */
                insecure?: boolean;
                /**
                 * Key is the key in the bucket where the artifact resides
                 */
                key?: string;
                /**
                 * Region contains the optional bucket region
                 */
                region?: string;
                /**
                 * RoleARN is the Amazon Resource Name (ARN) of the role to assume.
                 */
                roleARN?: string;
                /**
                 * SecretKeySecret is the secret selector to the bucket's secret key
                 */
                secretKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * UseSDKCreds tells the driver to figure out credentials based on sdk defaults.
                 */
                useSDKCreds?: boolean;
            }
            /**
             * S3ArtifactRepository defines the controller configuration for an S3 artifact repository
             */
            export interface IoArgoprojWorkflowV1alpha1S3ArtifactRepository {
                /**
                 * AccessKeySecret is the secret selector to the bucket's access key
                 */
                accessKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * Bucket is the name of the bucket
                 */
                bucket?: string;
                /**
                 * CreateBucketIfNotPresent tells the driver to attempt to create the S3 bucket for output artifacts, if it doesn't exist. Setting Enabled Encryption will apply either SSE-S3 to the bucket if KmsKeyId is not set or SSE-KMS if it is.
                 */
                createBucketIfNotPresent?: /* CreateS3BucketOptions options used to determine automatic automatic bucket-creation process */ IoArgoprojWorkflowV1alpha1CreateS3BucketOptions;
                encryptionOptions?: /* S3EncryptionOptions used to determine encryption options during s3 operations */ IoArgoprojWorkflowV1alpha1S3EncryptionOptions;
                /**
                 * Endpoint is the hostname of the bucket endpoint
                 */
                endpoint?: string;
                /**
                 * Insecure will connect to the service with TLS
                 */
                insecure?: boolean;
                /**
                 * KeyFormat is defines the format of how to store keys. Can reference workflow variables
                 */
                keyFormat?: string;
                /**
                 * KeyPrefix is prefix used as part of the bucket key in which the controller will store artifacts. DEPRECATED. Use KeyFormat instead
                 */
                keyPrefix?: string;
                /**
                 * Region contains the optional bucket region
                 */
                region?: string;
                /**
                 * RoleARN is the Amazon Resource Name (ARN) of the role to assume.
                 */
                roleARN?: string;
                /**
                 * SecretKeySecret is the secret selector to the bucket's secret key
                 */
                secretKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
                /**
                 * UseSDKCreds tells the driver to figure out credentials based on sdk defaults.
                 */
                useSDKCreds?: boolean;
            }
            /**
             * S3EncryptionOptions used to determine encryption options during s3 operations
             */
            export interface IoArgoprojWorkflowV1alpha1S3EncryptionOptions {
                /**
                 * EnableEncryption tells the driver to encrypt objects if set to true. If kmsKeyId and serverSideCustomerKeySecret are not set, SSE-S3 will be used
                 */
                enableEncryption?: boolean;
                /**
                 * KmsEncryptionContext is a json blob that contains an encryption context. See https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#encrypt_context for more information
                 */
                kmsEncryptionContext?: string;
                /**
                 * KMSKeyId tells the driver to encrypt the object using the specified KMS Key.
                 */
                kmsKeyId?: string;
                /**
                 * ServerSideCustomerKeySecret tells the driver to encrypt the output artifacts using SSE-C with the specified secret.
                 */
                serverSideCustomerKeySecret?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * ScriptTemplate is a template subtype to enable scripting through code steps
             */
            export interface IoArgoprojWorkflowV1alpha1ScriptTemplate {
                /**
                 * Arguments to the entrypoint. The container image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
                 */
                args?: string[];
                /**
                 * Entrypoint array. Not executed within a shell. The container image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
                 */
                command?: string[];
                /**
                 * List of environment variables to set in the container. Cannot be updated.
                 */
                env?: /* EnvVar represents an environment variable present in a Container. */ IoK8sApiCoreV1EnvVar[];
                /**
                 * List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.
                 */
                envFrom?: /* EnvFromSource represents the source of a set of ConfigMaps */ IoK8sApiCoreV1EnvFromSource[];
                /**
                 * Container image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.
                 */
                image: string;
                /**
                 * Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
                 */
                imagePullPolicy?: string;
                /**
                 * Actions that the management system should take in response to container lifecycle events. Cannot be updated.
                 */
                lifecycle?: /* Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted. */ IoK8sApiCoreV1Lifecycle;
                /**
                 * Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                livenessProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.
                 */
                name?: string;
                /**
                 * List of ports to expose from the container. Exposing a port here gives the system additional information about the network connections a container uses, but is primarily informational. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Cannot be updated.
                 */
                ports?: /* ContainerPort represents a network port in a single container. */ IoK8sApiCoreV1ContainerPort[];
                /**
                 * Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                readinessProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
                 */
                resources?: /* ResourceRequirements describes the compute resource requirements. */ IoK8sApiCoreV1ResourceRequirements;
                /**
                 * SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
                 */
                securityContext?: /* SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence. */ IoK8sApiCoreV1SecurityContext;
                /**
                 * Source contains the source code of the script to execute
                 */
                source: string;
                /**
                 * StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                startupProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.
                 */
                stdin?: boolean;
                /**
                 * Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false
                 */
                stdinOnce?: boolean;
                /**
                 * Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.
                 */
                terminationMessagePath?: string;
                /**
                 * Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
                 */
                terminationMessagePolicy?: string;
                /**
                 * Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
                 */
                tty?: boolean;
                /**
                 * volumeDevices is the list of block devices to be used by the container.
                 */
                volumeDevices?: /* volumeDevice describes a mapping of a raw block device within a container. */ IoK8sApiCoreV1VolumeDevice[];
                /**
                 * Pod volumes to mount into the container's filesystem. Cannot be updated.
                 */
                volumeMounts?: /* VolumeMount describes a mounting of a Volume within a container. */ IoK8sApiCoreV1VolumeMount[];
                /**
                 * Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
                 */
                workingDir?: string;
            }
            export interface IoArgoprojWorkflowV1alpha1SemaphoreHolding {
                /**
                 * Holders stores the list of current holder names in the io.argoproj.workflow.v1alpha1.
                 */
                holders?: string[];
                /**
                 * Semaphore stores the semaphore name.
                 */
                semaphore?: string;
            }
            /**
             * SemaphoreRef is a reference of Semaphore
             */
            export interface IoArgoprojWorkflowV1alpha1SemaphoreRef {
                /**
                 * ConfigMapKeyRef is configmap selector for Semaphore configuration
                 */
                configMapKeyRef?: /* Selects a key from a ConfigMap. */ IoK8sApiCoreV1ConfigMapKeySelector;
            }
            export interface IoArgoprojWorkflowV1alpha1SemaphoreStatus {
                /**
                 * Holding stores the list of resource acquired synchronization lock for workflows.
                 */
                holding?: IoArgoprojWorkflowV1alpha1SemaphoreHolding[];
                /**
                 * Waiting indicates the list of current synchronization lock holders.
                 */
                waiting?: IoArgoprojWorkflowV1alpha1SemaphoreHolding[];
            }
            /**
             * Sequence expands a workflow step into numeric range
             */
            export interface IoArgoprojWorkflowV1alpha1Sequence {
                /**
                 * Count is number of elements in the sequence (default: 0). Not to be used with end
                 */
                count?: IoK8sApimachineryPkgUtilIntstrIntOrString;
                /**
                 * Number at which to end the sequence (default: 0). Not to be used with Count
                 */
                end?: IoK8sApimachineryPkgUtilIntstrIntOrString;
                /**
                 * Format is a printf format string to format the value in the sequence
                 */
                format?: string;
                /**
                 * Number at which to start the sequence (default: 0)
                 */
                start?: IoK8sApimachineryPkgUtilIntstrIntOrString;
            }
            export interface IoArgoprojWorkflowV1alpha1Submit {
                /**
                 * Arguments extracted from the event and then set as arguments to the workflow created.
                 */
                arguments?: /* Arguments to a template */ IoArgoprojWorkflowV1alpha1Arguments;
                /**
                 * Metadata optional means to customize select fields of the workflow metadata
                 */
                metadata?: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                /**
                 * WorkflowTemplateRef the workflow template to submit
                 */
                workflowTemplateRef: /* WorkflowTemplateRef is a reference to a WorkflowTemplate resource. */ IoArgoprojWorkflowV1alpha1WorkflowTemplateRef;
            }
            /**
             * SubmitOpts are workflow submission options
             */
            export interface IoArgoprojWorkflowV1alpha1SubmitOpts {
                /**
                 * Annotations adds to metadata.labels
                 */
                annotations?: string;
                /**
                 * DryRun validates the workflow on the client-side without creating it. This option is not supported in API
                 */
                dryRun?: boolean;
                /**
                 * Entrypoint overrides spec.entrypoint
                 */
                entryPoint?: string;
                /**
                 * GenerateName overrides metadata.generateName
                 */
                generateName?: string;
                /**
                 * Labels adds to metadata.labels
                 */
                labels?: string;
                /**
                 * Name overrides metadata.name
                 */
                name?: string;
                /**
                 * OwnerReference creates a metadata.ownerReference
                 */
                ownerReference?: /* OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field. */ IoK8sApimachineryPkgApisMetaV1OwnerReference;
                /**
                 * Parameters passes input parameters to workflow
                 */
                parameters?: string[];
                /**
                 * Set the podPriorityClassName of the workflow
                 */
                podPriorityClassName?: string;
                /**
                 * Priority is used if controller is configured to process limited number of workflows in parallel, higher priority workflows are processed first.
                 */
                priority?: number;
                /**
                 * ServerDryRun validates the workflow on the server-side without creating it
                 */
                serverDryRun?: boolean;
                /**
                 * ServiceAccount runs all pods in the workflow using specified ServiceAccount.
                 */
                serviceAccount?: string;
            }
            /**
             * SuppliedValueFrom is a placeholder for a value to be filled in directly, either through the CLI, API, etc.
             */
            export interface IoArgoprojWorkflowV1alpha1SuppliedValueFrom {
            }
            /**
             * SuspendTemplate is a template subtype to suspend a workflow at a predetermined point in time
             */
            export interface IoArgoprojWorkflowV1alpha1SuspendTemplate {
                /**
                 * Duration is the seconds to wait before automatically resuming a template. Must be a string. Default unit is seconds. Could also be a Duration, e.g.: "2m", "6h", "1d"
                 */
                duration?: string;
            }
            /**
             * Synchronization holds synchronization lock configuration
             */
            export interface IoArgoprojWorkflowV1alpha1Synchronization {
                /**
                 * Mutex holds the Mutex lock details
                 */
                mutex?: /* Mutex holds Mutex configuration */ IoArgoprojWorkflowV1alpha1Mutex;
                /**
                 * Semaphore holds the Semaphore configuration
                 */
                semaphore?: /* SemaphoreRef is a reference of Semaphore */ IoArgoprojWorkflowV1alpha1SemaphoreRef;
            }
            /**
             * SynchronizationStatus stores the status of semaphore and mutex.
             */
            export interface IoArgoprojWorkflowV1alpha1SynchronizationStatus {
                /**
                 * Mutex stores this workflow's mutex holder details
                 */
                mutex?: /* MutexStatus contains which objects hold  mutex locks, and which objects this workflow is waiting on to release locks. */ IoArgoprojWorkflowV1alpha1MutexStatus;
                /**
                 * Semaphore stores this workflow's Semaphore holder details
                 */
                semaphore?: IoArgoprojWorkflowV1alpha1SemaphoreStatus;
            }
            /**
             * TTLStrategy is the strategy for the time to live depending on if the workflow succeeded or failed
             */
            export interface IoArgoprojWorkflowV1alpha1TTLStrategy {
                /**
                 * SecondsAfterCompletion is the number of seconds to live after completion
                 */
                secondsAfterCompletion?: number;
                /**
                 * SecondsAfterFailure is the number of seconds to live after failure
                 */
                secondsAfterFailure?: number;
                /**
                 * SecondsAfterSuccess is the number of seconds to live after success
                 */
                secondsAfterSuccess?: number;
            }
            /**
             * TarStrategy will tar and gzip the file or directory when saving
             */
            export interface IoArgoprojWorkflowV1alpha1TarStrategy {
                /**
                 * CompressionLevel specifies the gzip compression level to use for the artifact. Defaults to gzip.DefaultCompression.
                 */
                compressionLevel?: number;
            }
            /**
             * Template is a reusable and composable unit of execution in a workflow
             */
            export interface IoArgoprojWorkflowV1alpha1Template {
                /**
                 * Optional duration in seconds relative to the StartTime that the pod may be active on a node before the system actively tries to terminate the pod; value must be positive integer This field is only applicable to container and script templates.
                 */
                activeDeadlineSeconds?: IoK8sApimachineryPkgUtilIntstrIntOrString;
                /**
                 * Affinity sets the pod's scheduling constraints Overrides the affinity set at the workflow level (if any)
                 */
                affinity?: /* Affinity is a group of affinity scheduling rules. */ IoK8sApiCoreV1Affinity;
                /**
                 * Location in which all files related to the step will be stored (logs, artifacts, etc...). Can be overridden by individual items in Outputs. If omitted, will use the default artifact repository location configured in the controller, appended with the <workflowname>/<nodename> in the key.
                 */
                archiveLocation?: /* ArtifactLocation describes a location for a single or multiple artifacts. It is used as single artifact in the context of inputs/outputs (e.g. outputs.artifacts.artname). It is also used to describe the location of multiple artifacts such as the archive location of a single workflow step, which the executor will use as a default location to store its files. */ IoArgoprojWorkflowV1alpha1ArtifactLocation;
                /**
                 * AutomountServiceAccountToken indicates whether a service account token should be automatically mounted in pods. ServiceAccountName of ExecutorConfig must be specified if this value is false.
                 */
                automountServiceAccountToken?: boolean;
                /**
                 * Container is the main container image to run in the pod
                 */
                container?: /* A single application container that you want to run within a pod. */ IoK8sApiCoreV1Container;
                /**
                 * ContainerSet groups multiple containers within a single pod.
                 */
                containerSet?: IoArgoprojWorkflowV1alpha1ContainerSetTemplate;
                /**
                 * Daemon will allow a workflow to proceed to the next step so long as the container reaches readiness
                 */
                daemon?: boolean;
                /**
                 * DAG template subtype which runs a DAG
                 */
                dag?: /* DAGTemplate is a template subtype for directed acyclic graph templates */ IoArgoprojWorkflowV1alpha1DAGTemplate;
                /**
                 * Data is a data template
                 */
                data?: /* Data is a data template */ IoArgoprojWorkflowV1alpha1Data;
                /**
                 * Executor holds configurations of the executor container.
                 */
                executor?: /* ExecutorConfig holds configurations of an executor container. */ IoArgoprojWorkflowV1alpha1ExecutorConfig;
                /**
                 * FailFast, if specified, will fail this template if any of its child pods has failed. This is useful for when this template is expanded with `withItems`, etc.
                 */
                failFast?: boolean;
                /**
                 * HostAliases is an optional list of hosts and IPs that will be injected into the pod spec
                 */
                hostAliases?: /* HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file. */ IoK8sApiCoreV1HostAlias[];
                /**
                 * HTTP makes a HTTP request
                 */
                http?: IoArgoprojWorkflowV1alpha1HTTP;
                /**
                 * InitContainers is a list of containers which run before the main container.
                 */
                initContainers?: /* UserContainer is a container specified by a user. */ IoArgoprojWorkflowV1alpha1UserContainer[];
                /**
                 * Inputs describe what inputs parameters and artifacts are supplied to this template
                 */
                inputs?: /* Inputs are the mechanism for passing parameters, artifacts, volumes from one template to another */ IoArgoprojWorkflowV1alpha1Inputs;
                /**
                 * Memoize allows templates to use outputs generated from already executed templates
                 */
                memoize?: /* Memoization enables caching for the Outputs of the template */ IoArgoprojWorkflowV1alpha1Memoize;
                /**
                 * Metdata sets the pods's metadata, i.e. annotations and labels
                 */
                metadata?: /* Pod metdata */ IoArgoprojWorkflowV1alpha1Metadata;
                /**
                 * Metrics are a list of metrics emitted from this template
                 */
                metrics?: /* Metrics are a list of metrics emitted from a Workflow/Template */ IoArgoprojWorkflowV1alpha1Metrics;
                /**
                 * Name is the name of the template
                 */
                name?: string;
                /**
                 * NodeSelector is a selector to schedule this step of the workflow to be run on the selected node(s). Overrides the selector set at the workflow level.
                 */
                nodeSelector?: {
                    [name: string]: string;
                };
                /**
                 * Outputs describe the parameters and artifacts that this template produces
                 */
                outputs?: /* Outputs hold parameters, artifacts, and results from a step */ IoArgoprojWorkflowV1alpha1Outputs;
                /**
                 * Parallelism limits the max total parallel pods that can execute at the same time within the boundaries of this template invocation. If additional steps/dag templates are invoked, the pods created by those templates will not be counted towards this total.
                 */
                parallelism?: number;
                /**
                 * Plugin is a plugin template
                 */
                plugin?: /* Plugin is an Object with exactly one key */ IoArgoprojWorkflowV1alpha1Plugin;
                /**
                 * PodSpecPatch holds strategic merge patch to apply against the pod spec. Allows parameterization of container fields which are not strings (e.g. resource limits).
                 */
                podSpecPatch?: string;
                /**
                 * Priority to apply to workflow pods.
                 */
                priority?: number;
                /**
                 * PriorityClassName to apply to workflow pods.
                 */
                priorityClassName?: string;
                /**
                 * Resource template subtype which can run k8s resources
                 */
                resource?: /* ResourceTemplate is a template subtype to manipulate kubernetes resources */ IoArgoprojWorkflowV1alpha1ResourceTemplate;
                /**
                 * RetryStrategy describes how to retry a template when it fails
                 */
                retryStrategy?: /* RetryStrategy provides controls on how to retry a workflow step */ IoArgoprojWorkflowV1alpha1RetryStrategy;
                /**
                 * If specified, the pod will be dispatched by specified scheduler. Or it will be dispatched by workflow scope scheduler if specified. If neither specified, the pod will be dispatched by default scheduler.
                 */
                schedulerName?: string;
                /**
                 * Script runs a portion of code against an interpreter
                 */
                script?: /* ScriptTemplate is a template subtype to enable scripting through code steps */ IoArgoprojWorkflowV1alpha1ScriptTemplate;
                /**
                 * SecurityContext holds pod-level security attributes and common container settings. Optional: Defaults to empty.  See type description for default values of each field.
                 */
                securityContext?: /* PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext. */ IoK8sApiCoreV1PodSecurityContext;
                /**
                 * ServiceAccountName to apply to workflow pods
                 */
                serviceAccountName?: string;
                /**
                 * Sidecars is a list of containers which run alongside the main container Sidecars are automatically killed when the main container completes
                 */
                sidecars?: /* UserContainer is a container specified by a user. */ IoArgoprojWorkflowV1alpha1UserContainer[];
                /**
                 * Steps define a series of sequential/parallel workflow steps
                 */
                steps?: IoArgoprojWorkflowV1alpha1ParallelSteps[];
                /**
                 * Suspend template subtype which can suspend a workflow when reaching the step
                 */
                suspend?: /* SuspendTemplate is a template subtype to suspend a workflow at a predetermined point in time */ IoArgoprojWorkflowV1alpha1SuspendTemplate;
                /**
                 * Synchronization holds synchronization lock configuration for this template
                 */
                synchronization?: /* Synchronization holds synchronization lock configuration */ IoArgoprojWorkflowV1alpha1Synchronization;
                /**
                 * Timeout allows to set the total node execution timeout duration counting from the node's start time. This duration also includes time in which the node spends in Pending state. This duration may not be applied to Step or DAG templates.
                 */
                timeout?: string;
                /**
                 * Tolerations to apply to workflow pods.
                 */
                tolerations?: /* The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>. */ IoK8sApiCoreV1Toleration[];
                /**
                 * Volumes is a list of volumes that can be mounted by containers in a template.
                 */
                volumes?: /* Volume represents a named volume in a pod that may be accessed by any container in the pod. */ IoK8sApiCoreV1Volume[];
            }
            /**
             * TemplateRef is a reference of template resource.
             */
            export interface IoArgoprojWorkflowV1alpha1TemplateRef {
                /**
                 * ClusterScope indicates the referred template is cluster scoped (i.e. a ClusterWorkflowTemplate).
                 */
                clusterScope?: boolean;
                /**
                 * Name is the resource name of the template.
                 */
                name?: string;
                /**
                 * Template is the name of referred template in the resource.
                 */
                template?: string;
            }
            export interface IoArgoprojWorkflowV1alpha1TransformationStep {
                /**
                 * Expression defines an expr expression to apply
                 */
                expression: string;
            }
            /**
             * UserContainer is a container specified by a user.
             */
            export interface IoArgoprojWorkflowV1alpha1UserContainer {
                /**
                 * Arguments to the entrypoint. The container image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
                 */
                args?: string[];
                /**
                 * Entrypoint array. Not executed within a shell. The container image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
                 */
                command?: string[];
                /**
                 * List of environment variables to set in the container. Cannot be updated.
                 */
                env?: /* EnvVar represents an environment variable present in a Container. */ IoK8sApiCoreV1EnvVar[];
                /**
                 * List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.
                 */
                envFrom?: /* EnvFromSource represents the source of a set of ConfigMaps */ IoK8sApiCoreV1EnvFromSource[];
                /**
                 * Container image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.
                 */
                image?: string;
                /**
                 * Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
                 */
                imagePullPolicy?: string;
                /**
                 * Actions that the management system should take in response to container lifecycle events. Cannot be updated.
                 */
                lifecycle?: /* Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted. */ IoK8sApiCoreV1Lifecycle;
                /**
                 * Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                livenessProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * MirrorVolumeMounts will mount the same volumes specified in the main container to the container (including artifacts), at the same mountPaths. This enables dind daemon to partially see the same filesystem as the main container in order to use features such as docker volume binding
                 */
                mirrorVolumeMounts?: boolean;
                /**
                 * Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.
                 */
                name: string;
                /**
                 * List of ports to expose from the container. Exposing a port here gives the system additional information about the network connections a container uses, but is primarily informational. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Cannot be updated.
                 */
                ports?: /* ContainerPort represents a network port in a single container. */ IoK8sApiCoreV1ContainerPort[];
                /**
                 * Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                readinessProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
                 */
                resources?: /* ResourceRequirements describes the compute resource requirements. */ IoK8sApiCoreV1ResourceRequirements;
                /**
                 * SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
                 */
                securityContext?: /* SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence. */ IoK8sApiCoreV1SecurityContext;
                /**
                 * StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                startupProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.
                 */
                stdin?: boolean;
                /**
                 * Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false
                 */
                stdinOnce?: boolean;
                /**
                 * Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.
                 */
                terminationMessagePath?: string;
                /**
                 * Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
                 */
                terminationMessagePolicy?: string;
                /**
                 * Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
                 */
                tty?: boolean;
                /**
                 * volumeDevices is the list of block devices to be used by the container.
                 */
                volumeDevices?: /* volumeDevice describes a mapping of a raw block device within a container. */ IoK8sApiCoreV1VolumeDevice[];
                /**
                 * Pod volumes to mount into the container's filesystem. Cannot be updated.
                 */
                volumeMounts?: /* VolumeMount describes a mounting of a Volume within a container. */ IoK8sApiCoreV1VolumeMount[];
                /**
                 * Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
                 */
                workingDir?: string;
            }
            /**
             * ValueFrom describes a location in which to obtain the value to a parameter
             */
            export interface IoArgoprojWorkflowV1alpha1ValueFrom {
                /**
                 * ConfigMapKeyRef is configmap selector for input parameter configuration
                 */
                configMapKeyRef?: /* Selects a key from a ConfigMap. */ IoK8sApiCoreV1ConfigMapKeySelector;
                /**
                 * Default specifies a value to be used if retrieving the value from the specified source fails
                 */
                default?: string;
                /**
                 * Selector (https://github.com/antonmedv/expr) that is evaluated against the event to get the value of the parameter. E.g. `payload.message`
                 */
                event?: string;
                /**
                 * Expression, if defined, is evaluated to specify the value for the parameter
                 */
                expression?: string;
                /**
                 * JQFilter expression against the resource object in resource templates
                 */
                jqFilter?: string;
                /**
                 * JSONPath of a resource to retrieve an output parameter value from in resource templates
                 */
                jsonPath?: string;
                /**
                 * Parameter reference to a step or dag task in which to retrieve an output parameter value from (e.g. '{{steps.mystep.outputs.myparam}}')
                 */
                parameter?: string;
                /**
                 * Path in the container to retrieve an output parameter value from in container templates
                 */
                path?: string;
                /**
                 * Supplied value to be filled in directly, either through the CLI, API, etc.
                 */
                supplied?: /* SuppliedValueFrom is a placeholder for a value to be filled in directly, either through the CLI, API, etc. */ IoArgoprojWorkflowV1alpha1SuppliedValueFrom;
            }
            /**
             * VolumeClaimGC describes how to delete volumes from completed Workflows
             */
            export interface IoArgoprojWorkflowV1alpha1VolumeClaimGC {
                /**
                 * Strategy is the strategy to use. One of "OnWorkflowCompletion", "OnWorkflowSuccess"
                 */
                strategy?: string;
            }
            /**
             * Workflow is the definition of a workflow resource
             */
            export interface IoArgoprojWorkflowV1alpha1Workflow {
                /**
                 * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.io.k8s.community/contributors/devel/sig-architecture/api-conventions.md#resources
                 */
                apiVersion?: "argoproj.io/v1alpha1";
                /**
                 * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.io.k8s.community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
                 */
                kind?: "Workflow";
                metadata: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                spec: /* WorkflowSpec is the specification of a Workflow. */ IoArgoprojWorkflowV1alpha1WorkflowSpec;
                status?: /* WorkflowStatus contains overall status information about a workflow */ IoArgoprojWorkflowV1alpha1WorkflowStatus;
            }
            /**
             * WorkflowEventBinding is the definition of an event resource
             */
            export interface IoArgoprojWorkflowV1alpha1WorkflowEventBinding {
                /**
                 * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.io.k8s.community/contributors/devel/sig-architecture/api-conventions.md#resources
                 */
                apiVersion?: "argoproj.io/v1alpha1";
                /**
                 * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.io.k8s.community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
                 */
                kind?: "WorkflowEventBinding";
                metadata: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                spec: IoArgoprojWorkflowV1alpha1WorkflowEventBindingSpec;
            }
            export interface IoArgoprojWorkflowV1alpha1WorkflowEventBindingSpec {
                /**
                 * Event is the event to bind to
                 */
                event: IoArgoprojWorkflowV1alpha1Event;
                /**
                 * Submit is the workflow template to submit
                 */
                submit?: IoArgoprojWorkflowV1alpha1Submit;
            }
            /**
             * WorkflowLevelArtifactGC describes how to delete artifacts from completed Workflows - this spec is used on the Workflow level
             */
            export interface IoArgoprojWorkflowV1alpha1WorkflowLevelArtifactGC {
                /**
                 * ForceFinalizerRemoval: if set to true, the finalizer will be removed in the case that Artifact GC fails
                 */
                forceFinalizerRemoval?: boolean;
                /**
                 * PodMetadata is an optional field for specifying the Labels and Annotations that should be assigned to the Pod doing the deletion
                 */
                podMetadata?: /* Pod metdata */ IoArgoprojWorkflowV1alpha1Metadata;
                /**
                 * ServiceAccountName is an optional field for specifying the Service Account that should be assigned to the Pod doing the deletion
                 */
                serviceAccountName?: string;
                /**
                 * Strategy is the strategy to use.
                 */
                strategy?: string;
            }
            export interface IoArgoprojWorkflowV1alpha1WorkflowMetadata {
                annotations?: {
                    [name: string]: string;
                };
                labels?: {
                    [name: string]: string;
                };
                labelsFrom?: {
                    [name: string]: IoArgoprojWorkflowV1alpha1LabelValueFrom;
                };
            }
            /**
             * WorkflowSpec is the specification of a Workflow.
             */
            export interface IoArgoprojWorkflowV1alpha1WorkflowSpec {
                /**
                 * Optional duration in seconds relative to the workflow start time which the workflow is allowed to run before the controller terminates the io.argoproj.workflow.v1alpha1. A value of zero is used to terminate a Running workflow
                 */
                activeDeadlineSeconds?: number;
                /**
                 * Affinity sets the scheduling constraints for all pods in the io.argoproj.workflow.v1alpha1. Can be overridden by an affinity specified in the template
                 */
                affinity?: /* Affinity is a group of affinity scheduling rules. */ IoK8sApiCoreV1Affinity;
                /**
                 * ArchiveLogs indicates if the container logs should be archived
                 */
                archiveLogs?: boolean;
                /**
                 * Arguments contain the parameters and artifacts sent to the workflow entrypoint Parameters are referencable globally using the 'workflow' variable prefix. e.g. {{io.argoproj.workflow.v1alpha1.parameters.myparam}}
                 */
                arguments?: /* Arguments to a template */ IoArgoprojWorkflowV1alpha1Arguments;
                /**
                 * ArtifactGC describes the strategy to use when deleting artifacts from completed or deleted workflows (applies to all output Artifacts unless Artifact.ArtifactGC is specified, which overrides this)
                 */
                artifactGC?: /* WorkflowLevelArtifactGC describes how to delete artifacts from completed Workflows - this spec is used on the Workflow level */ IoArgoprojWorkflowV1alpha1WorkflowLevelArtifactGC;
                /**
                 * ArtifactRepositoryRef specifies the configMap name and key containing the artifact repository config.
                 */
                artifactRepositoryRef?: IoArgoprojWorkflowV1alpha1ArtifactRepositoryRef;
                /**
                 * AutomountServiceAccountToken indicates whether a service account token should be automatically mounted in pods. ServiceAccountName of ExecutorConfig must be specified if this value is false.
                 */
                automountServiceAccountToken?: boolean;
                /**
                 * PodDNSConfig defines the DNS parameters of a pod in addition to those generated from DNSPolicy.
                 */
                dnsConfig?: /* PodDNSConfig defines the DNS parameters of a pod in addition to those generated from DNSPolicy. */ IoK8sApiCoreV1PodDNSConfig;
                /**
                 * Set DNS policy for the pod. Defaults to "ClusterFirst". Valid values are 'ClusterFirstWithHostNet', 'ClusterFirst', 'Default' or 'None'. DNS parameters given in DNSConfig will be merged with the policy selected with DNSPolicy. To have DNS options set along with hostNetwork, you have to specify DNS policy explicitly to 'ClusterFirstWithHostNet'.
                 */
                dnsPolicy?: string;
                /**
                 * Entrypoint is a template reference to the starting point of the io.argoproj.workflow.v1alpha1.
                 */
                entrypoint?: string;
                /**
                 * Executor holds configurations of executor containers of the io.argoproj.workflow.v1alpha1.
                 */
                executor?: /* ExecutorConfig holds configurations of an executor container. */ IoArgoprojWorkflowV1alpha1ExecutorConfig;
                /**
                 * Hooks holds the lifecycle hook which is invoked at lifecycle of step, irrespective of the success, failure, or error status of the primary step
                 */
                hooks?: {
                    [name: string]: IoArgoprojWorkflowV1alpha1LifecycleHook;
                };
                hostAliases?: /* HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file. */ IoK8sApiCoreV1HostAlias[];
                /**
                 * Host networking requested for this workflow pod. Default to false.
                 */
                hostNetwork?: boolean;
                /**
                 * ImagePullSecrets is a list of references to secrets in the same namespace to use for pulling any images in pods that reference this ServiceAccount. ImagePullSecrets are distinct from Secrets because Secrets can be mounted in the pod, but ImagePullSecrets are only accessed by the kubelet. More info: https://kubernetes.io/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod
                 */
                imagePullSecrets?: /* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */ IoK8sApiCoreV1LocalObjectReference[];
                /**
                 * Metrics are a list of metrics emitted from this Workflow
                 */
                metrics?: /* Metrics are a list of metrics emitted from a Workflow/Template */ IoArgoprojWorkflowV1alpha1Metrics;
                /**
                 * NodeSelector is a selector which will result in all pods of the workflow to be scheduled on the selected node(s). This is able to be overridden by a nodeSelector specified in the template.
                 */
                nodeSelector?: {
                    [name: string]: string;
                };
                /**
                 * OnExit is a template reference which is invoked at the end of the workflow, irrespective of the success, failure, or error of the primary io.argoproj.workflow.v1alpha1.
                 */
                onExit?: string;
                /**
                 * Parallelism limits the max total parallel pods that can execute at the same time in a workflow
                 */
                parallelism?: number;
                /**
                 * PodDisruptionBudget holds the number of concurrent disruptions that you allow for Workflow's Pods. Controller will automatically add the selector with workflow name, if selector is empty. Optional: Defaults to empty.
                 */
                podDisruptionBudget?: /* PodDisruptionBudgetSpec is a description of a PodDisruptionBudget. */ IoK8sApiPolicyV1PodDisruptionBudgetSpec;
                /**
                 * PodGC describes the strategy to use when deleting completed pods
                 */
                podGC?: /* PodGC describes how to delete completed pods as they complete */ IoArgoprojWorkflowV1alpha1PodGC;
                /**
                 * PodMetadata defines additional metadata that should be applied to workflow pods
                 */
                podMetadata?: /* Pod metdata */ IoArgoprojWorkflowV1alpha1Metadata;
                /**
                 * Priority to apply to workflow pods. DEPRECATED: Use PodPriorityClassName instead.
                 */
                podPriority?: number;
                /**
                 * PriorityClassName to apply to workflow pods.
                 */
                podPriorityClassName?: string;
                /**
                 * PodSpecPatch holds strategic merge patch to apply against the pod spec. Allows parameterization of container fields which are not strings (e.g. resource limits).
                 */
                podSpecPatch?: string;
                /**
                 * Priority is used if controller is configured to process limited number of workflows in parallel. Workflows with higher priority are processed first.
                 */
                priority?: number;
                /**
                 * RetryStrategy for all templates in the io.argoproj.workflow.v1alpha1.
                 */
                retryStrategy?: /* RetryStrategy provides controls on how to retry a workflow step */ IoArgoprojWorkflowV1alpha1RetryStrategy;
                /**
                 * Set scheduler name for all pods. Will be overridden if container/script template's scheduler name is set. Default scheduler will be used if neither specified.
                 */
                schedulerName?: string;
                /**
                 * SecurityContext holds pod-level security attributes and common container settings. Optional: Defaults to empty.  See type description for default values of each field.
                 */
                securityContext?: /* PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext. */ IoK8sApiCoreV1PodSecurityContext;
                /**
                 * ServiceAccountName is the name of the ServiceAccount to run all pods of the workflow as.
                 */
                serviceAccountName?: string;
                /**
                 * Shutdown will shutdown the workflow according to its ShutdownStrategy
                 */
                shutdown?: string;
                /**
                 * Suspend will suspend the workflow and prevent execution of any future steps in the workflow
                 */
                suspend?: boolean;
                /**
                 * Synchronization holds synchronization lock configuration for this Workflow
                 */
                synchronization?: /* Synchronization holds synchronization lock configuration */ IoArgoprojWorkflowV1alpha1Synchronization;
                /**
                 * TemplateDefaults holds default template values that will apply to all templates in the Workflow, unless overridden on the template-level
                 */
                templateDefaults?: /* Template is a reusable and composable unit of execution in a workflow */ IoArgoprojWorkflowV1alpha1Template;
                /**
                 * Templates is a list of workflow templates used in a workflow
                 */
                templates?: /* Template is a reusable and composable unit of execution in a workflow */ IoArgoprojWorkflowV1alpha1Template[];
                /**
                 * Tolerations to apply to workflow pods.
                 */
                tolerations?: /* The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>. */ IoK8sApiCoreV1Toleration[];
                /**
                 * TTLStrategy limits the lifetime of a Workflow that has finished execution depending on if it Succeeded or Failed. If this struct is set, once the Workflow finishes, it will be deleted after the time to live expires. If this field is unset, the controller config map will hold the default values.
                 */
                ttlStrategy?: /* TTLStrategy is the strategy for the time to live depending on if the workflow succeeded or failed */ IoArgoprojWorkflowV1alpha1TTLStrategy;
                /**
                 * VolumeClaimGC describes the strategy to use when deleting volumes from completed workflows
                 */
                volumeClaimGC?: /* VolumeClaimGC describes how to delete volumes from completed Workflows */ IoArgoprojWorkflowV1alpha1VolumeClaimGC;
                /**
                 * VolumeClaimTemplates is a list of claims that containers are allowed to reference. The Workflow controller will create the claims at the beginning of the workflow and delete the claims upon completion of the workflow
                 */
                volumeClaimTemplates?: /* PersistentVolumeClaim is a user's request for and claim to a persistent volume */ IoK8sApiCoreV1PersistentVolumeClaim[];
                /**
                 * Volumes is a list of volumes that can be mounted by containers in a io.argoproj.workflow.v1alpha1.
                 */
                volumes?: /* Volume represents a named volume in a pod that may be accessed by any container in the pod. */ IoK8sApiCoreV1Volume[];
                /**
                 * WorkflowMetadata contains some metadata of the workflow to refer to
                 */
                workflowMetadata?: IoArgoprojWorkflowV1alpha1WorkflowMetadata;
                /**
                 * WorkflowTemplateRef holds a reference to a WorkflowTemplate for execution
                 */
                workflowTemplateRef?: /* WorkflowTemplateRef is a reference to a WorkflowTemplate resource. */ IoArgoprojWorkflowV1alpha1WorkflowTemplateRef;
            }
            /**
             * WorkflowStatus contains overall status information about a workflow
             */
            export interface IoArgoprojWorkflowV1alpha1WorkflowStatus {
                /**
                 * ArtifactGCStatus maintains the status of Artifact Garbage Collection
                 */
                artifactGCStatus?: /* ArtGCStatus maintains state related to ArtifactGC */ IoArgoprojWorkflowV1alpha1ArtGCStatus;
                /**
                 * ArtifactRepositoryRef is used to cache the repository to use so we do not need to determine it everytime we reconcile.
                 */
                artifactRepositoryRef?: IoArgoprojWorkflowV1alpha1ArtifactRepositoryRefStatus;
                /**
                 * Compressed and base64 decoded Nodes map
                 */
                compressedNodes?: string;
                /**
                 * Conditions is a list of conditions the Workflow may have
                 */
                conditions?: IoArgoprojWorkflowV1alpha1Condition[];
                /**
                 * EstimatedDuration in seconds.
                 */
                estimatedDuration?: number;
                /**
                 * Time at which this workflow completed
                 */
                finishedAt?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * A human readable message indicating details about why the workflow is in this condition.
                 */
                message?: string;
                /**
                 * Nodes is a mapping between a node ID and the node's status.
                 */
                nodes?: {
                    [name: string]: /* NodeStatus contains status information about an individual node in the workflow */ IoArgoprojWorkflowV1alpha1NodeStatus;
                };
                /**
                 * Whether on not node status has been offloaded to a database. If exists, then Nodes and CompressedNodes will be empty. This will actually be populated with a hash of the offloaded data.
                 */
                offloadNodeStatusVersion?: string;
                /**
                 * Outputs captures output values and artifact locations produced by the workflow via global outputs
                 */
                outputs?: /* Outputs hold parameters, artifacts, and results from a step */ IoArgoprojWorkflowV1alpha1Outputs;
                /**
                 * PersistentVolumeClaims tracks all PVCs that were created as part of the io.argoproj.workflow.v1alpha1. The contents of this list are drained at the end of the workflow.
                 */
                persistentVolumeClaims?: /* Volume represents a named volume in a pod that may be accessed by any container in the pod. */ IoK8sApiCoreV1Volume[];
                /**
                 * Phase a simple, high-level summary of where the workflow is in its lifecycle. Will be "" (Unknown), "Pending", or "Running" before the workflow is completed, and "Succeeded", "Failed" or "Error" once the workflow has completed.
                 */
                phase?: string;
                /**
                 * Progress to completion
                 */
                progress?: string;
                /**
                 * ResourcesDuration is the total for the workflow
                 */
                resourcesDuration?: {
                    [name: string]: number; // int64
                };
                /**
                 * Time at which this workflow started
                 */
                startedAt?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * StoredTemplates is a mapping between a template ref and the node's status.
                 */
                storedTemplates?: {
                    [name: string]: /* Template is a reusable and composable unit of execution in a workflow */ IoArgoprojWorkflowV1alpha1Template;
                };
                /**
                 * StoredWorkflowSpec stores the WorkflowTemplate spec for future execution.
                 */
                storedWorkflowTemplateSpec?: /* WorkflowSpec is the specification of a Workflow. */ IoArgoprojWorkflowV1alpha1WorkflowSpec;
                /**
                 * Synchronization stores the status of synchronization locks
                 */
                synchronization?: /* SynchronizationStatus stores the status of semaphore and mutex. */ IoArgoprojWorkflowV1alpha1SynchronizationStatus;
            }
            /**
             * WorkflowStep is a reference to a template to execute in a series of step
             */
            export interface IoArgoprojWorkflowV1alpha1WorkflowStep {
                /**
                 * Arguments hold arguments to the template
                 */
                arguments?: /* Arguments to a template */ IoArgoprojWorkflowV1alpha1Arguments;
                /**
                 * ContinueOn makes argo to proceed with the following step even if this step fails. Errors and Failed states can be specified
                 */
                continueOn?: /* ContinueOn defines if a workflow should continue even if a task or step fails/errors. It can be specified if the workflow should continue when the pod errors, fails or both. */ IoArgoprojWorkflowV1alpha1ContinueOn;
                /**
                 * Hooks holds the lifecycle hook which is invoked at lifecycle of step, irrespective of the success, failure, or error status of the primary step
                 */
                hooks?: {
                    [name: string]: IoArgoprojWorkflowV1alpha1LifecycleHook;
                };
                /**
                 * Inline is the template. Template must be empty if this is declared (and vice-versa).
                 */
                inline?: /* Template is a reusable and composable unit of execution in a workflow */ IoArgoprojWorkflowV1alpha1Template;
                /**
                 * Name of the step
                 */
                name?: string;
                /**
                 * OnExit is a template reference which is invoked at the end of the template, irrespective of the success, failure, or error of the primary template. DEPRECATED: Use Hooks[exit].Template instead.
                 */
                onExit?: string;
                /**
                 * Template is the name of the template to execute as the step
                 */
                template?: string;
                /**
                 * TemplateRef is the reference to the template resource to execute as the step.
                 */
                templateRef?: /* TemplateRef is a reference of template resource. */ IoArgoprojWorkflowV1alpha1TemplateRef;
                /**
                 * When is an expression in which the step should conditionally execute
                 */
                when?: string;
                /**
                 * WithItems expands a step into multiple parallel steps from the items in the list
                 */
                withItems?: /* Item expands a single workflow step into multiple parallel steps The value of Item can be a map, string, bool, or number */ IoArgoprojWorkflowV1alpha1Item[];
                /**
                 * WithParam expands a step into multiple parallel steps from the value in the parameter, which is expected to be a JSON list.
                 */
                withParam?: string;
                /**
                 * WithSequence expands a step into a numeric sequence
                 */
                withSequence?: /* Sequence expands a workflow step into numeric range */ IoArgoprojWorkflowV1alpha1Sequence;
            }
            /**
             * WorkflowTemplate is the definition of a workflow template resource
             */
            export interface IoArgoprojWorkflowV1alpha1WorkflowTemplate {
                /**
                 * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.io.k8s.community/contributors/devel/sig-architecture/api-conventions.md#resources
                 */
                apiVersion?: "argoproj.io/v1alpha1";
                /**
                 * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.io.k8s.community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
                 */
                kind?: "WorkflowTemplate";
                metadata: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                spec: /* WorkflowSpec is the specification of a Workflow. */ IoArgoprojWorkflowV1alpha1WorkflowSpec;
            }
            /**
             * WorkflowTemplateRef is a reference to a WorkflowTemplate resource.
             */
            export interface IoArgoprojWorkflowV1alpha1WorkflowTemplateRef {
                /**
                 * ClusterScope indicates the referred template is cluster scoped (i.e. a ClusterWorkflowTemplate).
                 */
                clusterScope?: boolean;
                /**
                 * Name is the resource name of the workflow template.
                 */
                name?: string;
            }
            /**
             * ZipStrategy will unzip zipped input artifacts
             */
            export interface IoArgoprojWorkflowV1alpha1ZipStrategy {
            }
            /**
             * Represents a Persistent Disk resource in AWS.
             *
             * An AWS EBS disk must exist before mounting to a container. The disk must also be in the same AWS zone as the kubelet. An AWS EBS disk can only be mounted as read/write once. AWS EBS volumes support ownership management and SELinux relabeling.
             */
            export interface IoK8sApiCoreV1AWSElasticBlockStoreVolumeSource {
                /**
                 * Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
                 */
                fsType?: string;
                /**
                 * The partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).
                 */
                partition?: number;
                /**
                 * Specify "true" to force and set the ReadOnly property in VolumeMounts to "true". If omitted, the default is "false". More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
                 */
                readOnly?: boolean;
                /**
                 * Unique ID of the persistent disk resource in AWS (Amazon EBS volume). More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
                 */
                volumeID: string;
            }
            /**
             * Affinity is a group of affinity scheduling rules.
             */
            export interface IoK8sApiCoreV1Affinity {
                /**
                 * Describes node affinity scheduling rules for the pod.
                 */
                nodeAffinity?: /* Node affinity is a group of node affinity scheduling rules. */ IoK8sApiCoreV1NodeAffinity;
                /**
                 * Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).
                 */
                podAffinity?: /* Pod affinity is a group of inter pod affinity scheduling rules. */ IoK8sApiCoreV1PodAffinity;
                /**
                 * Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).
                 */
                podAntiAffinity?: /* Pod anti affinity is a group of inter pod anti affinity scheduling rules. */ IoK8sApiCoreV1PodAntiAffinity;
            }
            /**
             * AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.
             */
            export interface IoK8sApiCoreV1AzureDiskVolumeSource {
                /**
                 * Host Caching mode: None, Read Only, Read Write.
                 */
                cachingMode?: string;
                /**
                 * The Name of the data disk in the blob storage
                 */
                diskName: string;
                /**
                 * The URI the data disk in the blob storage
                 */
                diskURI: string;
                /**
                 * Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
                 */
                fsType?: string;
                /**
                 * Expected values Shared: multiple blob disks per storage account  Dedicated: single blob disk per storage account  Managed: azure managed data disk (only in managed availability set). defaults to shared
                 */
                kind?: string;
                /**
                 * Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
                 */
                readOnly?: boolean;
            }
            /**
             * AzureFile represents an Azure File Service mount on the host and bind mount to the pod.
             */
            export interface IoK8sApiCoreV1AzureFileVolumeSource {
                /**
                 * Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
                 */
                readOnly?: boolean;
                /**
                 * the name of secret that contains Azure Storage Account Name and Key
                 */
                secretName: string;
                /**
                 * Share Name
                 */
                shareName: string;
            }
            /**
             * Represents a source location of a volume to mount, managed by an external CSI driver
             */
            export interface IoK8sApiCoreV1CSIVolumeSource {
                /**
                 * Driver is the name of the CSI driver that handles this volume. Consult with your admin for the correct name as registered in the cluster.
                 */
                driver: string;
                /**
                 * Filesystem type to mount. Ex. "ext4", "xfs", "ntfs". If not provided, the empty value is passed to the associated CSI driver which will determine the default filesystem to apply.
                 */
                fsType?: string;
                /**
                 * NodePublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodePublishVolume and NodeUnpublishVolume calls. This field is optional, and  may be empty if no secret is required. If the secret object contains more than one secret, all secret references are passed.
                 */
                nodePublishSecretRef?: /* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */ IoK8sApiCoreV1LocalObjectReference;
                /**
                 * Specifies a read-only configuration for the volume. Defaults to false (read/write).
                 */
                readOnly?: boolean;
                /**
                 * VolumeAttributes stores driver-specific properties that are passed to the CSI driver. Consult your driver's documentation for supported values.
                 */
                volumeAttributes?: {
                    [name: string]: string;
                };
            }
            /**
             * Adds and removes POSIX capabilities from running containers.
             */
            export interface IoK8sApiCoreV1Capabilities {
                /**
                 * Added capabilities
                 */
                add?: string[];
                /**
                 * Removed capabilities
                 */
                drop?: string[];
            }
            /**
             * Represents a Ceph Filesystem mount that lasts the lifetime of a pod Cephfs volumes do not support ownership management or SELinux relabeling.
             */
            export interface IoK8sApiCoreV1CephFSVolumeSource {
                /**
                 * Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
                 */
                monitors: string[];
                /**
                 * Optional: Used as the mounted root, rather than the full Ceph tree, default is /
                 */
                path?: string;
                /**
                 * Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
                 */
                readOnly?: boolean;
                /**
                 * Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
                 */
                secretFile?: string;
                /**
                 * Optional: SecretRef is reference to the authentication secret for User, default is empty. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
                 */
                secretRef?: /* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */ IoK8sApiCoreV1LocalObjectReference;
                /**
                 * Optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
                 */
                user?: string;
            }
            /**
             * Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling.
             */
            export interface IoK8sApiCoreV1CinderVolumeSource {
                /**
                 * Filesystem type to mount. Must be a filesystem type supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://examples.k8s.io/mysql-cinder-pd/README.md
                 */
                fsType?: string;
                /**
                 * Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/mysql-cinder-pd/README.md
                 */
                readOnly?: boolean;
                /**
                 * Optional: points to a secret object containing parameters used to connect to OpenStack.
                 */
                secretRef?: /* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */ IoK8sApiCoreV1LocalObjectReference;
                /**
                 * volume id used to identify the volume in cinder. More info: https://examples.k8s.io/mysql-cinder-pd/README.md
                 */
                volumeID: string;
            }
            /**
             * ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.
             *
             * The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.
             */
            export interface IoK8sApiCoreV1ConfigMapEnvSource {
                /**
                 * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
                 */
                name?: string;
                /**
                 * Specify whether the ConfigMap must be defined
                 */
                optional?: boolean;
            }
            /**
             * Selects a key from a ConfigMap.
             */
            export interface IoK8sApiCoreV1ConfigMapKeySelector {
                /**
                 * The key to select.
                 */
                key: string;
                /**
                 * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
                 */
                name?: string;
                /**
                 * Specify whether the ConfigMap or its key must be defined
                 */
                optional?: boolean;
            }
            /**
             * Adapts a ConfigMap into a projected volume.
             *
             * The contents of the target ConfigMap's Data field will be presented in a projected volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. Note that this is identical to a configmap volume source without the default mode.
             */
            export interface IoK8sApiCoreV1ConfigMapProjection {
                /**
                 * If unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
                 */
                items?: /* Maps a string key to a path within a volume. */ IoK8sApiCoreV1KeyToPath[];
                /**
                 * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
                 */
                name?: string;
                /**
                 * Specify whether the ConfigMap or its keys must be defined
                 */
                optional?: boolean;
            }
            /**
             * Adapts a ConfigMap into a volume.
             *
             * The contents of the target ConfigMap's Data field will be presented in a volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. ConfigMap volumes support ownership management and SELinux relabeling.
             */
            export interface IoK8sApiCoreV1ConfigMapVolumeSource {
                /**
                 * Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
                 */
                defaultMode?: number;
                /**
                 * If unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
                 */
                items?: /* Maps a string key to a path within a volume. */ IoK8sApiCoreV1KeyToPath[];
                /**
                 * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
                 */
                name?: string;
                /**
                 * Specify whether the ConfigMap or its keys must be defined
                 */
                optional?: boolean;
            }
            /**
             * A single application container that you want to run within a pod.
             */
            export interface IoK8sApiCoreV1Container {
                /**
                 * Arguments to the entrypoint. The docker image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
                 */
                args?: string[];
                /**
                 * Entrypoint array. Not executed within a shell. The docker image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
                 */
                command?: string[];
                /**
                 * List of environment variables to set in the container. Cannot be updated.
                 */
                env?: /* EnvVar represents an environment variable present in a Container. */ IoK8sApiCoreV1EnvVar[];
                /**
                 * List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.
                 */
                envFrom?: /* EnvFromSource represents the source of a set of ConfigMaps */ IoK8sApiCoreV1EnvFromSource[];
                /**
                 * Docker image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.
                 */
                image: string;
                /**
                 * Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
                 *
                 * Possible enum values:
                 *  - `"Always"` means that kubelet always attempts to pull the latest image. Container will fail If the pull fails.
                 *  - `"IfNotPresent"` means that kubelet pulls if the image isn't present on disk. Container will fail if the image isn't present and the pull fails.
                 *  - `"Never"` means that kubelet never pulls an image, but only uses a local image. Container will fail if the image isn't present
                 */
                imagePullPolicy?: "Always" | "IfNotPresent" | "Never";
                /**
                 * Actions that the management system should take in response to container lifecycle events. Cannot be updated.
                 */
                lifecycle?: /* Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted. */ IoK8sApiCoreV1Lifecycle;
                /**
                 * Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                livenessProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.
                 */
                name?: string;
                /**
                 * List of ports to expose from the container. Exposing a port here gives the system additional information about the network connections a container uses, but is primarily informational. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Cannot be updated.
                 */
                ports?: /* ContainerPort represents a network port in a single container. */ IoK8sApiCoreV1ContainerPort[];
                /**
                 * Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                readinessProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
                 */
                resources?: /* ResourceRequirements describes the compute resource requirements. */ IoK8sApiCoreV1ResourceRequirements;
                /**
                 * SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
                 */
                securityContext?: /* SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence. */ IoK8sApiCoreV1SecurityContext;
                /**
                 * StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                startupProbe?: /* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */ IoK8sApiCoreV1Probe;
                /**
                 * Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.
                 */
                stdin?: boolean;
                /**
                 * Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false
                 */
                stdinOnce?: boolean;
                /**
                 * Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.
                 */
                terminationMessagePath?: string;
                /**
                 * Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
                 *
                 * Possible enum values:
                 *  - `"FallbackToLogsOnError"` will read the most recent contents of the container logs for the container status message when the container exits with an error and the terminationMessagePath has no contents.
                 *  - `"File"` is the default behavior and will set the container status message to the contents of the container's terminationMessagePath when the container exits.
                 */
                terminationMessagePolicy?: "FallbackToLogsOnError" | "File";
                /**
                 * Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
                 */
                tty?: boolean;
                /**
                 * volumeDevices is the list of block devices to be used by the container.
                 */
                volumeDevices?: /* volumeDevice describes a mapping of a raw block device within a container. */ IoK8sApiCoreV1VolumeDevice[];
                /**
                 * Pod volumes to mount into the container's filesystem. Cannot be updated.
                 */
                volumeMounts?: /* VolumeMount describes a mounting of a Volume within a container. */ IoK8sApiCoreV1VolumeMount[];
                /**
                 * Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
                 */
                workingDir?: string;
            }
            /**
             * ContainerPort represents a network port in a single container.
             */
            export interface IoK8sApiCoreV1ContainerPort {
                /**
                 * Number of port to expose on the pod's IP address. This must be a valid port number, 0 < x < 65536.
                 */
                containerPort: number;
                /**
                 * What host IP to bind the external port to.
                 */
                hostIP?: string;
                /**
                 * Number of port to expose on the host. If specified, this must be a valid port number, 0 < x < 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.
                 */
                hostPort?: number;
                /**
                 * If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.
                 */
                name?: string;
                /**
                 * Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".
                 *
                 * Possible enum values:
                 *  - `"SCTP"` is the SCTP protocol.
                 *  - `"TCP"` is the TCP protocol.
                 *  - `"UDP"` is the UDP protocol.
                 */
                protocol?: "SCTP" | "TCP" | "UDP";
            }
            /**
             * Represents downward API info for projecting into a projected volume. Note that this is identical to a downwardAPI volume source without the default mode.
             */
            export interface IoK8sApiCoreV1DownwardAPIProjection {
                /**
                 * Items is a list of DownwardAPIVolume file
                 */
                items?: /* DownwardAPIVolumeFile represents information to create the file containing the pod field */ IoK8sApiCoreV1DownwardAPIVolumeFile[];
            }
            /**
             * DownwardAPIVolumeFile represents information to create the file containing the pod field
             */
            export interface IoK8sApiCoreV1DownwardAPIVolumeFile {
                /**
                 * Required: Selects a field of the pod: only annotations, labels, name and namespace are supported.
                 */
                fieldRef?: /* ObjectFieldSelector selects an APIVersioned field of an object. */ IoK8sApiCoreV1ObjectFieldSelector;
                /**
                 * Optional: mode bits used to set permissions on this file, must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
                 */
                mode?: number;
                /**
                 * Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..'
                 */
                path: string;
                /**
                 * Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.
                 */
                resourceFieldRef?: /* ResourceFieldSelector represents container resources (cpu, memory) and their output format */ IoK8sApiCoreV1ResourceFieldSelector;
            }
            /**
             * DownwardAPIVolumeSource represents a volume containing downward API info. Downward API volumes support ownership management and SELinux relabeling.
             */
            export interface IoK8sApiCoreV1DownwardAPIVolumeSource {
                /**
                 * Optional: mode bits to use on created files by default. Must be a Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
                 */
                defaultMode?: number;
                /**
                 * Items is a list of downward API volume file
                 */
                items?: /* DownwardAPIVolumeFile represents information to create the file containing the pod field */ IoK8sApiCoreV1DownwardAPIVolumeFile[];
            }
            /**
             * Represents an empty directory for a pod. Empty directory volumes support ownership management and SELinux relabeling.
             */
            export interface IoK8sApiCoreV1EmptyDirVolumeSource {
                /**
                 * What type of storage medium should back this directory. The default is "" which means to use the node's default medium. Must be an empty string (default) or Memory. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir
                 */
                medium?: string;
                /**
                 * Total amount of local storage required for this EmptyDir volume. The size limit is also applicable for memory medium. The maximum usage on memory medium EmptyDir would be the minimum value between the SizeLimit specified here and the sum of memory limits of all containers in a pod. The default is nil which means that the limit is undefined. More info: http://kubernetes.io/docs/user-guide/volumes#emptydir
                 */
                sizeLimit?: /**
                 * Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.
                 *
                 * The serialization format is:
                 *
                 * <quantity>        ::= <signedNumber><suffix>
                 *   (Note that <suffix> may be empty, from the "" case in <decimalSI>.)
                 * <digit>           ::= 0 | 1 | ... | 9 <digits>          ::= <digit> | <digit><digits> <number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> <sign>            ::= "+" | "-" <signedNumber>    ::= <number> | <sign><number> <suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> <binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei
                 *   (International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)
                 * <decimalSI>       ::= m | "" | k | M | G | T | P | E
                 *   (Note that 1024 = 1Ki but 1000 = 1k; I didn't choose the capitalization.)
                 * <decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber>
                 *
                 * No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.
                 *
                 * When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.
                 *
                 * Before serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:
                 *   a. No precision is lost
                 *   b. No fractional digits will be emitted
                 *   c. The exponent (or suffix) is as large as possible.
                 * The sign will be omitted unless the number is negative.
                 *
                 * Examples:
                 *   1.5 will be serialized as "1500m"
                 *   1.5Gi will be serialized as "1536Mi"
                 *
                 * Note that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.
                 *
                 * Non-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)
                 *
                 * This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.
                 */
                IoK8sApimachineryPkgApiResourceQuantity;
            }
            /**
             * EnvFromSource represents the source of a set of ConfigMaps
             */
            export interface IoK8sApiCoreV1EnvFromSource {
                /**
                 * The ConfigMap to select from
                 */
                configMapRef?: /**
                 * ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.
                 *
                 * The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.
                 */
                IoK8sApiCoreV1ConfigMapEnvSource;
                /**
                 * An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.
                 */
                prefix?: string;
                /**
                 * The Secret to select from
                 */
                secretRef?: /**
                 * SecretEnvSource selects a Secret to populate the environment variables with.
                 *
                 * The contents of the target Secret's Data field will represent the key-value pairs as environment variables.
                 */
                IoK8sApiCoreV1SecretEnvSource;
            }
            /**
             * EnvVar represents an environment variable present in a Container.
             */
            export interface IoK8sApiCoreV1EnvVar {
                /**
                 * Name of the environment variable. Must be a C_IDENTIFIER.
                 */
                name: string;
                /**
                 * Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".
                 */
                value?: string;
                /**
                 * Source for the environment variable's value. Cannot be used if value is not empty.
                 */
                valueFrom?: /* EnvVarSource represents a source for the value of an EnvVar. */ IoK8sApiCoreV1EnvVarSource;
            }
            /**
             * EnvVarSource represents a source for the value of an EnvVar.
             */
            export interface IoK8sApiCoreV1EnvVarSource {
                /**
                 * Selects a key of a ConfigMap.
                 */
                configMapKeyRef?: /* Selects a key from a ConfigMap. */ IoK8sApiCoreV1ConfigMapKeySelector;
                /**
                 * Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['<KEY>']`, `metadata.annotations['<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.
                 */
                fieldRef?: /* ObjectFieldSelector selects an APIVersioned field of an object. */ IoK8sApiCoreV1ObjectFieldSelector;
                /**
                 * Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.
                 */
                resourceFieldRef?: /* ResourceFieldSelector represents container resources (cpu, memory) and their output format */ IoK8sApiCoreV1ResourceFieldSelector;
                /**
                 * Selects a key of a secret in the pod's namespace
                 */
                secretKeyRef?: /* SecretKeySelector selects a key of a Secret. */ IoK8sApiCoreV1SecretKeySelector;
            }
            /**
             * Represents an ephemeral volume that is handled by a normal storage driver.
             */
            export interface IoK8sApiCoreV1EphemeralVolumeSource {
                /**
                 * Will be used to create a stand-alone PVC to provision the volume. The pod in which this EphemeralVolumeSource is embedded will be the owner of the PVC, i.e. the PVC will be deleted together with the pod.  The name of the PVC will be `<pod name>-<volume name>` where `<volume name>` is the name from the `PodSpec.Volumes` array entry. Pod validation will reject the pod if the concatenated name is not valid for a PVC (for example, too long).
                 *
                 * An existing PVC with that name that is not owned by the pod will *not* be used for the pod to avoid using an unrelated volume by mistake. Starting the pod is then blocked until the unrelated PVC is removed. If such a pre-created PVC is meant to be used by the pod, the PVC has to updated with an owner reference to the pod once the pod exists. Normally this should not be necessary, but it may be useful when manually reconstructing a broken cluster.
                 *
                 * This field is read-only and no changes will be made by Kubernetes to the PVC after it has been created.
                 *
                 * Required, must not be nil.
                 */
                volumeClaimTemplate?: /* PersistentVolumeClaimTemplate is used to produce PersistentVolumeClaim objects as part of an EphemeralVolumeSource. */ IoK8sApiCoreV1PersistentVolumeClaimTemplate;
            }
            /**
             * EventSeries contain information on series of events, i.e. thing that was/is happening continuously for some time.
             */
            export interface IoK8sApiCoreV1EventSeries {
                /**
                 * Number of occurrences in this series up to the last heartbeat time
                 */
                count?: number;
                /**
                 * Time of the last occurrence observed
                 */
                lastObservedTime?: /* MicroTime is version of Time with microsecond level precision. */ IoK8sApimachineryPkgApisMetaV1MicroTime /* date-time */;
            }
            /**
             * EventSource contains information for an event.
             */
            export interface IoK8sApiCoreV1EventSource {
                /**
                 * Component from which the event is generated.
                 */
                component?: string;
                /**
                 * Node name on which the event is generated.
                 */
                host?: string;
            }
            /**
             * ExecAction describes a "run in container" action.
             */
            export interface IoK8sApiCoreV1ExecAction {
                /**
                 * Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.
                 */
                command?: string[];
            }
            /**
             * Represents a Fibre Channel volume. Fibre Channel volumes can only be mounted as read/write once. Fibre Channel volumes support ownership management and SELinux relabeling.
             */
            export interface IoK8sApiCoreV1FCVolumeSource {
                /**
                 * Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
                 */
                fsType?: string;
                /**
                 * Optional: FC target lun number
                 */
                lun?: number;
                /**
                 * Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
                 */
                readOnly?: boolean;
                /**
                 * Optional: FC target worldwide names (WWNs)
                 */
                targetWWNs?: string[];
                /**
                 * Optional: FC volume world wide identifiers (wwids) Either wwids or combination of targetWWNs and lun must be set, but not both simultaneously.
                 */
                wwids?: string[];
            }
            /**
             * FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin.
             */
            export interface IoK8sApiCoreV1FlexVolumeSource {
                /**
                 * Driver is the name of the driver to use for this volume.
                 */
                driver: string;
                /**
                 * Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default filesystem depends on FlexVolume script.
                 */
                fsType?: string;
                /**
                 * Optional: Extra command options if any.
                 */
                options?: {
                    [name: string]: string;
                };
                /**
                 * Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
                 */
                readOnly?: boolean;
                /**
                 * Optional: SecretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts.
                 */
                secretRef?: /* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */ IoK8sApiCoreV1LocalObjectReference;
            }
            /**
             * Represents a Flocker volume mounted by the Flocker agent. One and only one of datasetName and datasetUUID should be set. Flocker volumes do not support ownership management or SELinux relabeling.
             */
            export interface IoK8sApiCoreV1FlockerVolumeSource {
                /**
                 * Name of the dataset stored as metadata -> name on the dataset for Flocker should be considered as deprecated
                 */
                datasetName?: string;
                /**
                 * UUID of the dataset. This is unique identifier of a Flocker dataset
                 */
                datasetUUID?: string;
            }
            /**
             * Represents a Persistent Disk resource in Google Compute Engine.
             *
             * A GCE PD must exist before mounting to a container. The disk must also be in the same GCE project and zone as the kubelet. A GCE PD can only be mounted as read/write once or read-only many times. GCE PDs support ownership management and SELinux relabeling.
             */
            export interface IoK8sApiCoreV1GCEPersistentDiskVolumeSource {
                /**
                 * Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
                 */
                fsType?: string;
                /**
                 * The partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty). More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
                 */
                partition?: number;
                /**
                 * Unique name of the PD resource in GCE. Used to identify the disk in GCE. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
                 */
                pdName: string;
                /**
                 * ReadOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
                 */
                readOnly?: boolean;
            }
            export interface IoK8sApiCoreV1GRPCAction {
                /**
                 * Port number of the gRPC service. Number must be in the range 1 to 65535.
                 */
                port: number;
                /**
                 * Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).
                 *
                 * If this is not specified, the default behavior is defined by gRPC.
                 */
                service?: string;
            }
            /**
             * Represents a volume that is populated with the contents of a git repository. Git repo volumes do not support ownership management. Git repo volumes support SELinux relabeling.
             *
             * DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.
             */
            export interface IoK8sApiCoreV1GitRepoVolumeSource {
                /**
                 * Target directory name. Must not contain or start with '..'.  If '.' is supplied, the volume directory will be the git repository.  Otherwise, if specified, the volume will contain the git repository in the subdirectory with the given name.
                 */
                directory?: string;
                /**
                 * Repository URL
                 */
                repository: string;
                /**
                 * Commit hash for the specified revision.
                 */
                revision?: string;
            }
            /**
             * Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling.
             */
            export interface IoK8sApiCoreV1GlusterfsVolumeSource {
                /**
                 * EndpointsName is the endpoint name that details Glusterfs topology. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod
                 */
                endpoints: string;
                /**
                 * Path is the Glusterfs volume path. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod
                 */
                path: string;
                /**
                 * ReadOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod
                 */
                readOnly?: boolean;
            }
            /**
             * HTTPGetAction describes an action based on HTTP Get requests.
             */
            export interface IoK8sApiCoreV1HTTPGetAction {
                /**
                 * Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.
                 */
                host?: string;
                /**
                 * Custom headers to set in the request. HTTP allows repeated headers.
                 */
                httpHeaders?: /* HTTPHeader describes a custom header to be used in HTTP probes */ IoK8sApiCoreV1HTTPHeader[];
                /**
                 * Path to access on the HTTP server.
                 */
                path?: string;
                /**
                 * Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.
                 */
                port: IoK8sApimachineryPkgUtilIntstrIntOrString;
                /**
                 * Scheme to use for connecting to the host. Defaults to HTTP.
                 *
                 * Possible enum values:
                 *  - `"HTTP"` means that the scheme used will be http://
                 *  - `"HTTPS"` means that the scheme used will be https://
                 */
                scheme?: "HTTP" | "HTTPS";
            }
            /**
             * HTTPHeader describes a custom header to be used in HTTP probes
             */
            export interface IoK8sApiCoreV1HTTPHeader {
                /**
                 * The header field name
                 */
                name: string;
                /**
                 * The header field value
                 */
                value: string;
            }
            /**
             * HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.
             */
            export interface IoK8sApiCoreV1HostAlias {
                /**
                 * Hostnames for the above IP address.
                 */
                hostnames?: string[];
                /**
                 * IP address of the host file entry.
                 */
                ip?: string;
            }
            /**
             * Represents a host path mapped into a pod. Host path volumes do not support ownership management or SELinux relabeling.
             */
            export interface IoK8sApiCoreV1HostPathVolumeSource {
                /**
                 * Path of the directory on the host. If the path is a symlink, it will follow the link to the real path. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath
                 */
                path: string;
                /**
                 * Type for HostPath Volume Defaults to "" More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath
                 */
                type?: string;
            }
            /**
             * Represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling.
             */
            export interface IoK8sApiCoreV1ISCSIVolumeSource {
                /**
                 * whether support iSCSI Discovery CHAP authentication
                 */
                chapAuthDiscovery?: boolean;
                /**
                 * whether support iSCSI Session CHAP authentication
                 */
                chapAuthSession?: boolean;
                /**
                 * Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#iscsi
                 */
                fsType?: string;
                /**
                 * Custom iSCSI Initiator Name. If initiatorName is specified with iscsiInterface simultaneously, new iSCSI interface <target portal>:<volume name> will be created for the connection.
                 */
                initiatorName?: string;
                /**
                 * Target iSCSI Qualified Name.
                 */
                iqn: string;
                /**
                 * iSCSI Interface Name that uses an iSCSI transport. Defaults to 'default' (tcp).
                 */
                iscsiInterface?: string;
                /**
                 * iSCSI Target Lun number.
                 */
                lun: number;
                /**
                 * iSCSI Target Portal List. The portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).
                 */
                portals?: string[];
                /**
                 * ReadOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false.
                 */
                readOnly?: boolean;
                /**
                 * CHAP Secret for iSCSI target and initiator authentication
                 */
                secretRef?: /* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */ IoK8sApiCoreV1LocalObjectReference;
                /**
                 * iSCSI Target Portal. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).
                 */
                targetPortal: string;
            }
            /**
             * Maps a string key to a path within a volume.
             */
            export interface IoK8sApiCoreV1KeyToPath {
                /**
                 * The key to project.
                 */
                key: string;
                /**
                 * Optional: mode bits used to set permissions on this file. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
                 */
                mode?: number;
                /**
                 * The relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'.
                 */
                path: string;
            }
            /**
             * Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.
             */
            export interface IoK8sApiCoreV1Lifecycle {
                /**
                 * PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
                 */
                postStart?: /* LifecycleHandler defines a specific action that should be taken in a lifecycle hook. One and only one of the fields, except TCPSocket must be specified. */ IoK8sApiCoreV1LifecycleHandler;
                /**
                 * PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
                 */
                preStop?: /* LifecycleHandler defines a specific action that should be taken in a lifecycle hook. One and only one of the fields, except TCPSocket must be specified. */ IoK8sApiCoreV1LifecycleHandler;
            }
            /**
             * LifecycleHandler defines a specific action that should be taken in a lifecycle hook. One and only one of the fields, except TCPSocket must be specified.
             */
            export interface IoK8sApiCoreV1LifecycleHandler {
                /**
                 * Exec specifies the action to take.
                 */
                exec?: /* ExecAction describes a "run in container" action. */ IoK8sApiCoreV1ExecAction;
                /**
                 * HTTPGet specifies the http request to perform.
                 */
                httpGet?: /* HTTPGetAction describes an action based on HTTP Get requests. */ IoK8sApiCoreV1HTTPGetAction;
                /**
                 * Deprecated. TCPSocket is NOT supported as a LifecycleHandler and kept for the backward compatibility. There are no validation of this field and lifecycle hooks will fail in runtime when tcp handler is specified.
                 */
                tcpSocket?: /* TCPSocketAction describes an action based on opening a socket */ IoK8sApiCoreV1TCPSocketAction;
            }
            /**
             * LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace.
             */
            export interface IoK8sApiCoreV1LocalObjectReference {
                /**
                 * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
                 */
                name?: string;
            }
            /**
             * Represents an NFS mount that lasts the lifetime of a pod. NFS volumes do not support ownership management or SELinux relabeling.
             */
            export interface IoK8sApiCoreV1NFSVolumeSource {
                /**
                 * Path that is exported by the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
                 */
                path: string;
                /**
                 * ReadOnly here will force the NFS export to be mounted with read-only permissions. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
                 */
                readOnly?: boolean;
                /**
                 * Server is the hostname or IP address of the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
                 */
                server: string;
            }
            /**
             * Node affinity is a group of node affinity scheduling rules.
             */
            export interface IoK8sApiCoreV1NodeAffinity {
                /**
                 * The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node matches the corresponding matchExpressions; the node(s) with the highest sum are the most preferred.
                 */
                preferredDuringSchedulingIgnoredDuringExecution?: /* An empty preferred scheduling term matches all objects with implicit weight 0 (i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op). */ IoK8sApiCoreV1PreferredSchedulingTerm[];
                /**
                 * If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to an update), the system may or may not try to eventually evict the pod from its node.
                 */
                requiredDuringSchedulingIgnoredDuringExecution?: /* A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms. */ IoK8sApiCoreV1NodeSelector;
            }
            /**
             * A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.
             */
            export interface IoK8sApiCoreV1NodeSelector {
                /**
                 * Required. A list of node selector terms. The terms are ORed.
                 */
                nodeSelectorTerms: /* A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm. */ IoK8sApiCoreV1NodeSelectorTerm[];
            }
            /**
             * A node selector requirement is a selector that contains values, a key, and an operator that relates the key and values.
             */
            export interface IoK8sApiCoreV1NodeSelectorRequirement {
                /**
                 * The label key that the selector applies to.
                 */
                key: string;
                /**
                 * Represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.
                 *
                 * Possible enum values:
                 *  - `"DoesNotExist"`
                 *  - `"Exists"`
                 *  - `"Gt"`
                 *  - `"In"`
                 *  - `"Lt"`
                 *  - `"NotIn"`
                 */
                operator: "DoesNotExist" | "Exists" | "Gt" | "In" | "Lt" | "NotIn";
                /**
                 * An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. If the operator is Gt or Lt, the values array must have a single element, which will be interpreted as an integer. This array is replaced during a strategic merge patch.
                 */
                values?: string[];
            }
            /**
             * A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.
             */
            export interface IoK8sApiCoreV1NodeSelectorTerm {
                /**
                 * A list of node selector requirements by node's labels.
                 */
                matchExpressions?: /* A node selector requirement is a selector that contains values, a key, and an operator that relates the key and values. */ IoK8sApiCoreV1NodeSelectorRequirement[];
                /**
                 * A list of node selector requirements by node's fields.
                 */
                matchFields?: /* A node selector requirement is a selector that contains values, a key, and an operator that relates the key and values. */ IoK8sApiCoreV1NodeSelectorRequirement[];
            }
            /**
             * ObjectFieldSelector selects an APIVersioned field of an object.
             */
            export interface IoK8sApiCoreV1ObjectFieldSelector {
                /**
                 * Version of the schema the FieldPath is written in terms of, defaults to "v1".
                 */
                apiVersion?: string;
                /**
                 * Path of the field to select in the specified API version.
                 */
                fieldPath: string;
            }
            /**
             * ObjectReference contains enough information to let you inspect or modify the referred object.
             */
            export interface IoK8sApiCoreV1ObjectReference {
                /**
                 * API version of the referent.
                 */
                apiVersion?: string;
                /**
                 * If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2]. For example, if the object reference is to a container within a pod, this would take on a value like: "spec.containers{name}" (where "name" refers to the name of the container that triggered the event) or if no container name is specified "spec.containers[2]" (container with index 2 in this pod). This syntax is chosen only to have some well-defined way of referencing a part of an object.
                 */
                fieldPath?: string;
                /**
                 * Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
                 */
                kind?: string;
                /**
                 * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
                 */
                name?: string;
                /**
                 * Namespace of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
                 */
                namespace?: string;
                /**
                 * Specific resourceVersion to which this reference is made, if any. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
                 */
                resourceVersion?: string;
                /**
                 * UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids
                 */
                uid?: string;
            }
            /**
             * PersistentVolumeClaim is a user's request for and claim to a persistent volume
             */
            export interface IoK8sApiCoreV1PersistentVolumeClaim {
                /**
                 * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
                 */
                apiVersion?: string;
                /**
                 * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
                 */
                kind?: string;
                /**
                 * Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
                 */
                metadata?: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                /**
                 * Spec defines the desired characteristics of a volume requested by a pod author. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
                 */
                spec?: /* PersistentVolumeClaimSpec describes the common attributes of storage devices and allows a Source for provider-specific attributes */ IoK8sApiCoreV1PersistentVolumeClaimSpec;
                /**
                 * Status represents the current information/status of a persistent volume claim. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
                 */
                status?: /* PersistentVolumeClaimStatus is the current status of a persistent volume claim. */ IoK8sApiCoreV1PersistentVolumeClaimStatus;
            }
            /**
             * PersistentVolumeClaimCondition contails details about state of pvc
             */
            export interface IoK8sApiCoreV1PersistentVolumeClaimCondition {
                /**
                 * Last time we probed the condition.
                 */
                lastProbeTime?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * Last time the condition transitioned from one status to another.
                 */
                lastTransitionTime?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * Human-readable message indicating details about last transition.
                 */
                message?: string;
                /**
                 * Unique, this should be a short, machine understandable string that gives the reason for condition's last transition. If it reports "ResizeStarted" that means the underlying persistent volume is being resized.
                 */
                reason?: string;
                status: string;
                /**
                 *
                 *
                 *
                 * Possible enum values:
                 *  - `"FileSystemResizePending"` - controller resize is finished and a file system resize is pending on node
                 *  - `"Resizing"` - a user trigger resize of pvc has been started
                 */
                type: "FileSystemResizePending" | "Resizing";
            }
            /**
             * PersistentVolumeClaimSpec describes the common attributes of storage devices and allows a Source for provider-specific attributes
             */
            export interface IoK8sApiCoreV1PersistentVolumeClaimSpec {
                /**
                 * AccessModes contains the desired access modes the volume should have. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1
                 */
                accessModes?: string[];
                /**
                 * This field can be used to specify either: * An existing VolumeSnapshot object (snapshot.storage.k8s.io/VolumeSnapshot) * An existing PVC (PersistentVolumeClaim) If the provisioner or an external controller can support the specified data source, it will create a new volume based on the contents of the specified data source. If the AnyVolumeDataSource feature gate is enabled, this field will always have the same contents as the DataSourceRef field.
                 */
                dataSource?: /* TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace. */ IoK8sApiCoreV1TypedLocalObjectReference;
                /**
                 * Specifies the object from which to populate the volume with data, if a non-empty volume is desired. This may be any local object from a non-empty API group (non core object) or a PersistentVolumeClaim object. When this field is specified, volume binding will only succeed if the type of the specified object matches some installed volume populator or dynamic provisioner. This field will replace the functionality of the DataSource field and as such if both fields are non-empty, they must have the same value. For backwards compatibility, both fields (DataSource and DataSourceRef) will be set to the same value automatically if one of them is empty and the other is non-empty. There are two important differences between DataSource and DataSourceRef: * While DataSource only allows two specific types of objects, DataSourceRef
                 *   allows any non-core object, as well as PersistentVolumeClaim objects.
                 * * While DataSource ignores disallowed values (dropping them), DataSourceRef
                 *   preserves all values, and generates an error if a disallowed value is
                 *   specified.
                 * (Alpha) Using this field requires the AnyVolumeDataSource feature gate to be enabled.
                 */
                dataSourceRef?: /* TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace. */ IoK8sApiCoreV1TypedLocalObjectReference;
                /**
                 * Resources represents the minimum resources the volume should have. If RecoverVolumeExpansionFailure feature is enabled users are allowed to specify resource requirements that are lower than previous value but must still be higher than capacity recorded in the status field of the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources
                 */
                resources?: /* ResourceRequirements describes the compute resource requirements. */ IoK8sApiCoreV1ResourceRequirements;
                /**
                 * A label query over volumes to consider for binding.
                 */
                selector?: /* A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects. */ IoK8sApimachineryPkgApisMetaV1LabelSelector;
                /**
                 * Name of the StorageClass required by the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1
                 */
                storageClassName?: string;
                /**
                 * volumeMode defines what type of volume is required by the claim. Value of Filesystem is implied when not included in claim spec.
                 */
                volumeMode?: string;
                /**
                 * VolumeName is the binding reference to the PersistentVolume backing this claim.
                 */
                volumeName?: string;
            }
            /**
             * PersistentVolumeClaimStatus is the current status of a persistent volume claim.
             */
            export interface IoK8sApiCoreV1PersistentVolumeClaimStatus {
                /**
                 * AccessModes contains the actual access modes the volume backing the PVC has. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1
                 */
                accessModes?: string[];
                /**
                 * The storage resource within AllocatedResources tracks the capacity allocated to a PVC. It may be larger than the actual capacity when a volume expansion operation is requested. For storage quota, the larger value from allocatedResources and PVC.spec.resources is used. If allocatedResources is not set, PVC.spec.resources alone is used for quota calculation. If a volume expansion capacity request is lowered, allocatedResources is only lowered if there are no expansion operations in progress and if the actual volume capacity is equal or lower than the requested capacity. This is an alpha field and requires enabling RecoverVolumeExpansionFailure feature.
                 */
                allocatedResources?: {
                    [name: string]: /**
                     * Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.
                     *
                     * The serialization format is:
                     *
                     * <quantity>        ::= <signedNumber><suffix>
                     *   (Note that <suffix> may be empty, from the "" case in <decimalSI>.)
                     * <digit>           ::= 0 | 1 | ... | 9 <digits>          ::= <digit> | <digit><digits> <number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> <sign>            ::= "+" | "-" <signedNumber>    ::= <number> | <sign><number> <suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> <binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei
                     *   (International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)
                     * <decimalSI>       ::= m | "" | k | M | G | T | P | E
                     *   (Note that 1024 = 1Ki but 1000 = 1k; I didn't choose the capitalization.)
                     * <decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber>
                     *
                     * No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.
                     *
                     * When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.
                     *
                     * Before serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:
                     *   a. No precision is lost
                     *   b. No fractional digits will be emitted
                     *   c. The exponent (or suffix) is as large as possible.
                     * The sign will be omitted unless the number is negative.
                     *
                     * Examples:
                     *   1.5 will be serialized as "1500m"
                     *   1.5Gi will be serialized as "1536Mi"
                     *
                     * Note that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.
                     *
                     * Non-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)
                     *
                     * This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.
                     */
                    IoK8sApimachineryPkgApiResourceQuantity;
                };
                /**
                 * Represents the actual resources of the underlying volume.
                 */
                capacity?: {
                    [name: string]: /**
                     * Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.
                     *
                     * The serialization format is:
                     *
                     * <quantity>        ::= <signedNumber><suffix>
                     *   (Note that <suffix> may be empty, from the "" case in <decimalSI>.)
                     * <digit>           ::= 0 | 1 | ... | 9 <digits>          ::= <digit> | <digit><digits> <number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> <sign>            ::= "+" | "-" <signedNumber>    ::= <number> | <sign><number> <suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> <binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei
                     *   (International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)
                     * <decimalSI>       ::= m | "" | k | M | G | T | P | E
                     *   (Note that 1024 = 1Ki but 1000 = 1k; I didn't choose the capitalization.)
                     * <decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber>
                     *
                     * No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.
                     *
                     * When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.
                     *
                     * Before serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:
                     *   a. No precision is lost
                     *   b. No fractional digits will be emitted
                     *   c. The exponent (or suffix) is as large as possible.
                     * The sign will be omitted unless the number is negative.
                     *
                     * Examples:
                     *   1.5 will be serialized as "1500m"
                     *   1.5Gi will be serialized as "1536Mi"
                     *
                     * Note that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.
                     *
                     * Non-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)
                     *
                     * This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.
                     */
                    IoK8sApimachineryPkgApiResourceQuantity;
                };
                /**
                 * Current Condition of persistent volume claim. If underlying persistent volume is being resized then the Condition will be set to 'ResizeStarted'.
                 */
                conditions?: /* PersistentVolumeClaimCondition contails details about state of pvc */ IoK8sApiCoreV1PersistentVolumeClaimCondition[];
                /**
                 * Phase represents the current phase of PersistentVolumeClaim.
                 *
                 * Possible enum values:
                 *  - `"Bound"` used for PersistentVolumeClaims that are bound
                 *  - `"Lost"` used for PersistentVolumeClaims that lost their underlying PersistentVolume. The claim was bound to a PersistentVolume and this volume does not exist any longer and all data on it was lost.
                 *  - `"Pending"` used for PersistentVolumeClaims that are not yet bound
                 */
                phase?: "Bound" | "Lost" | "Pending";
                /**
                 * ResizeStatus stores status of resize operation. ResizeStatus is not set by default but when expansion is complete resizeStatus is set to empty string by resize controller or kubelet. This is an alpha field and requires enabling RecoverVolumeExpansionFailure feature.
                 */
                resizeStatus?: string;
            }
            /**
             * PersistentVolumeClaimTemplate is used to produce PersistentVolumeClaim objects as part of an EphemeralVolumeSource.
             */
            export interface IoK8sApiCoreV1PersistentVolumeClaimTemplate {
                /**
                 * May contain labels and annotations that will be copied into the PVC when creating it. No other fields are allowed and will be rejected during validation.
                 */
                metadata?: /* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */ IoK8sApimachineryPkgApisMetaV1ObjectMeta;
                /**
                 * The specification for the PersistentVolumeClaim. The entire content is copied unchanged into the PVC that gets created from this template. The same fields as in a PersistentVolumeClaim are also valid here.
                 */
                spec: /* PersistentVolumeClaimSpec describes the common attributes of storage devices and allows a Source for provider-specific attributes */ IoK8sApiCoreV1PersistentVolumeClaimSpec;
            }
            /**
             * PersistentVolumeClaimVolumeSource references the user's PVC in the same namespace. This volume finds the bound PV and mounts that volume for the pod. A PersistentVolumeClaimVolumeSource is, essentially, a wrapper around another type of volume that is owned by someone else (the system).
             */
            export interface IoK8sApiCoreV1PersistentVolumeClaimVolumeSource {
                /**
                 * ClaimName is the name of a PersistentVolumeClaim in the same namespace as the pod using this volume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
                 */
                claimName: string;
                /**
                 * Will force the ReadOnly setting in VolumeMounts. Default false.
                 */
                readOnly?: boolean;
            }
            /**
             * Represents a Photon Controller persistent disk resource.
             */
            export interface IoK8sApiCoreV1PhotonPersistentDiskVolumeSource {
                /**
                 * Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
                 */
                fsType?: string;
                /**
                 * ID that identifies Photon Controller persistent disk
                 */
                pdID: string;
            }
            /**
             * Pod affinity is a group of inter pod affinity scheduling rules.
             */
            export interface IoK8sApiCoreV1PodAffinity {
                /**
                 * The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.
                 */
                preferredDuringSchedulingIgnoredDuringExecution?: /* The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s) */ IoK8sApiCoreV1WeightedPodAffinityTerm[];
                /**
                 * If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.
                 */
                requiredDuringSchedulingIgnoredDuringExecution?: /* Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running */ IoK8sApiCoreV1PodAffinityTerm[];
            }
            /**
             * Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running
             */
            export interface IoK8sApiCoreV1PodAffinityTerm {
                /**
                 * A label query over a set of resources, in this case pods.
                 */
                labelSelector?: /* A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects. */ IoK8sApimachineryPkgApisMetaV1LabelSelector;
                /**
                 * A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces. This field is beta-level and is only honored when PodAffinityNamespaceSelector feature is enabled.
                 */
                namespaceSelector?: /* A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects. */ IoK8sApimachineryPkgApisMetaV1LabelSelector;
                /**
                 * namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace"
                 */
                namespaces?: string[];
                /**
                 * This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.
                 */
                topologyKey: string;
            }
            /**
             * Pod anti affinity is a group of inter pod anti affinity scheduling rules.
             */
            export interface IoK8sApiCoreV1PodAntiAffinity {
                /**
                 * The scheduler will prefer to schedule pods to nodes that satisfy the anti-affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling anti-affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.
                 */
                preferredDuringSchedulingIgnoredDuringExecution?: /* The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s) */ IoK8sApiCoreV1WeightedPodAffinityTerm[];
                /**
                 * If the anti-affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the anti-affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.
                 */
                requiredDuringSchedulingIgnoredDuringExecution?: /* Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running */ IoK8sApiCoreV1PodAffinityTerm[];
            }
            /**
             * PodDNSConfig defines the DNS parameters of a pod in addition to those generated from DNSPolicy.
             */
            export interface IoK8sApiCoreV1PodDNSConfig {
                /**
                 * A list of DNS name server IP addresses. This will be appended to the base nameservers generated from DNSPolicy. Duplicated nameservers will be removed.
                 */
                nameservers?: string[];
                /**
                 * A list of DNS resolver options. This will be merged with the base options generated from DNSPolicy. Duplicated entries will be removed. Resolution options given in Options will override those that appear in the base DNSPolicy.
                 */
                options?: /* PodDNSConfigOption defines DNS resolver options of a pod. */ IoK8sApiCoreV1PodDNSConfigOption[];
                /**
                 * A list of DNS search domains for host-name lookup. This will be appended to the base search paths generated from DNSPolicy. Duplicated search paths will be removed.
                 */
                searches?: string[];
            }
            /**
             * PodDNSConfigOption defines DNS resolver options of a pod.
             */
            export interface IoK8sApiCoreV1PodDNSConfigOption {
                /**
                 * Required.
                 */
                name?: string;
                value?: string;
            }
            /**
             * PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext.
             */
            export interface IoK8sApiCoreV1PodSecurityContext {
                /**
                 * A special supplemental group that applies to all containers in a pod. Some volume types allow the Kubelet to change the ownership of that volume to be owned by the pod:
                 *
                 * 1. The owning GID will be the FSGroup 2. The setgid bit is set (new files created in the volume will be owned by FSGroup) 3. The permission bits are OR'd with rw-rw----
                 *
                 * If unset, the Kubelet will not modify the ownership and permissions of any volume. Note that this field cannot be set when spec.os.name is windows.
                 */
                fsGroup?: number;
                /**
                 * fsGroupChangePolicy defines behavior of changing ownership and permission of the volume before being exposed inside Pod. This field will only apply to volume types which support fsGroup based ownership(and permissions). It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir. Valid values are "OnRootMismatch" and "Always". If not specified, "Always" is used. Note that this field cannot be set when spec.os.name is windows.
                 */
                fsGroupChangePolicy?: string;
                /**
                 * The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
                 */
                runAsGroup?: number;
                /**
                 * Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
                 */
                runAsNonRoot?: boolean;
                /**
                 * The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
                 */
                runAsUser?: number;
                /**
                 * The SELinux context to be applied to all containers. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
                 */
                seLinuxOptions?: /* SELinuxOptions are the labels to be applied to the container */ IoK8sApiCoreV1SELinuxOptions;
                /**
                 * The seccomp options to use by the containers in this pod. Note that this field cannot be set when spec.os.name is windows.
                 */
                seccompProfile?: /* SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set. */ IoK8sApiCoreV1SeccompProfile;
                /**
                 * A list of groups applied to the first process run in each container, in addition to the container's primary GID.  If unspecified, no groups will be added to any container. Note that this field cannot be set when spec.os.name is windows.
                 */
                supplementalGroups?: number /* int64 */[];
                /**
                 * Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported sysctls (by the container runtime) might fail to launch. Note that this field cannot be set when spec.os.name is windows.
                 */
                sysctls?: /* Sysctl defines a kernel parameter to be set */ IoK8sApiCoreV1Sysctl[];
                /**
                 * The Windows specific settings applied to all containers. If unspecified, the options within a container's SecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.
                 */
                windowsOptions?: /* WindowsSecurityContextOptions contain Windows-specific options and credentials. */ IoK8sApiCoreV1WindowsSecurityContextOptions;
            }
            /**
             * PortworxVolumeSource represents a Portworx volume resource.
             */
            export interface IoK8sApiCoreV1PortworxVolumeSource {
                /**
                 * FSType represents the filesystem type to mount Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs". Implicitly inferred to be "ext4" if unspecified.
                 */
                fsType?: string;
                /**
                 * Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
                 */
                readOnly?: boolean;
                /**
                 * VolumeID uniquely identifies a Portworx volume
                 */
                volumeID: string;
            }
            /**
             * An empty preferred scheduling term matches all objects with implicit weight 0 (i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).
             */
            export interface IoK8sApiCoreV1PreferredSchedulingTerm {
                /**
                 * A node selector term, associated with the corresponding weight.
                 */
                preference: /* A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm. */ IoK8sApiCoreV1NodeSelectorTerm;
                /**
                 * Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.
                 */
                weight: number;
            }
            /**
             * Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.
             */
            export interface IoK8sApiCoreV1Probe {
                /**
                 * Exec specifies the action to take.
                 */
                exec?: /* ExecAction describes a "run in container" action. */ IoK8sApiCoreV1ExecAction;
                /**
                 * Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.
                 */
                failureThreshold?: number;
                /**
                 * GRPC specifies an action involving a GRPC port. This is an alpha field and requires enabling GRPCContainerProbe feature gate.
                 */
                grpc?: IoK8sApiCoreV1GRPCAction;
                /**
                 * HTTPGet specifies the http request to perform.
                 */
                httpGet?: /* HTTPGetAction describes an action based on HTTP Get requests. */ IoK8sApiCoreV1HTTPGetAction;
                /**
                 * Number of seconds after the container has started before liveness probes are initiated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                initialDelaySeconds?: number;
                /**
                 * How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.
                 */
                periodSeconds?: number;
                /**
                 * Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.
                 */
                successThreshold?: number;
                /**
                 * TCPSocket specifies an action involving a TCP port.
                 */
                tcpSocket?: /* TCPSocketAction describes an action based on opening a socket */ IoK8sApiCoreV1TCPSocketAction;
                /**
                 * Optional duration in seconds the pod needs to terminate gracefully upon probe failure. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. If this value is nil, the pod's terminationGracePeriodSeconds will be used. Otherwise, this value overrides the value provided by the pod spec. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). This is a beta field and requires enabling ProbeTerminationGracePeriod feature gate. Minimum value is 1. spec.terminationGracePeriodSeconds is used if unset.
                 */
                terminationGracePeriodSeconds?: number;
                /**
                 * Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
                 */
                timeoutSeconds?: number;
            }
            /**
             * Represents a projected volume source
             */
            export interface IoK8sApiCoreV1ProjectedVolumeSource {
                /**
                 * Mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
                 */
                defaultMode?: number;
                /**
                 * list of volume projections
                 */
                sources?: /* Projection that may be projected along with other supported volume types */ IoK8sApiCoreV1VolumeProjection[];
            }
            /**
             * Represents a Quobyte mount that lasts the lifetime of a pod. Quobyte volumes do not support ownership management or SELinux relabeling.
             */
            export interface IoK8sApiCoreV1QuobyteVolumeSource {
                /**
                 * Group to map volume access to Default is no group
                 */
                group?: string;
                /**
                 * ReadOnly here will force the Quobyte volume to be mounted with read-only permissions. Defaults to false.
                 */
                readOnly?: boolean;
                /**
                 * Registry represents a single or multiple Quobyte Registry services specified as a string as host:port pair (multiple entries are separated with commas) which acts as the central registry for volumes
                 */
                registry: string;
                /**
                 * Tenant owning the given Quobyte volume in the Backend Used with dynamically provisioned Quobyte volumes, value is set by the plugin
                 */
                tenant?: string;
                /**
                 * User to map volume access to Defaults to serivceaccount user
                 */
                user?: string;
                /**
                 * Volume is a string that references an already created Quobyte volume by name.
                 */
                volume: string;
            }
            /**
             * Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling.
             */
            export interface IoK8sApiCoreV1RBDVolumeSource {
                /**
                 * Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#rbd
                 */
                fsType?: string;
                /**
                 * The rados image name. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
                 */
                image: string;
                /**
                 * Keyring is the path to key ring for RBDUser. Default is /etc/ceph/keyring. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
                 */
                keyring?: string;
                /**
                 * A collection of Ceph monitors. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
                 */
                monitors: string[];
                /**
                 * The rados pool name. Default is rbd. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
                 */
                pool?: string;
                /**
                 * ReadOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
                 */
                readOnly?: boolean;
                /**
                 * SecretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
                 */
                secretRef?: /* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */ IoK8sApiCoreV1LocalObjectReference;
                /**
                 * The rados user name. Default is admin. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
                 */
                user?: string;
            }
            /**
             * ResourceFieldSelector represents container resources (cpu, memory) and their output format
             */
            export interface IoK8sApiCoreV1ResourceFieldSelector {
                /**
                 * Container name: required for volumes, optional for env vars
                 */
                containerName?: string;
                /**
                 * Specifies the output format of the exposed resources, defaults to "1"
                 */
                divisor?: /**
                 * Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.
                 *
                 * The serialization format is:
                 *
                 * <quantity>        ::= <signedNumber><suffix>
                 *   (Note that <suffix> may be empty, from the "" case in <decimalSI>.)
                 * <digit>           ::= 0 | 1 | ... | 9 <digits>          ::= <digit> | <digit><digits> <number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> <sign>            ::= "+" | "-" <signedNumber>    ::= <number> | <sign><number> <suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> <binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei
                 *   (International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)
                 * <decimalSI>       ::= m | "" | k | M | G | T | P | E
                 *   (Note that 1024 = 1Ki but 1000 = 1k; I didn't choose the capitalization.)
                 * <decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber>
                 *
                 * No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.
                 *
                 * When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.
                 *
                 * Before serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:
                 *   a. No precision is lost
                 *   b. No fractional digits will be emitted
                 *   c. The exponent (or suffix) is as large as possible.
                 * The sign will be omitted unless the number is negative.
                 *
                 * Examples:
                 *   1.5 will be serialized as "1500m"
                 *   1.5Gi will be serialized as "1536Mi"
                 *
                 * Note that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.
                 *
                 * Non-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)
                 *
                 * This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.
                 */
                IoK8sApimachineryPkgApiResourceQuantity;
                /**
                 * Required: resource to select
                 */
                resource: string;
            }
            /**
             * ResourceRequirements describes the compute resource requirements.
             */
            export interface IoK8sApiCoreV1ResourceRequirements {
                /**
                 * Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
                 */
                limits?: {
                    [name: string]: /**
                     * Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.
                     *
                     * The serialization format is:
                     *
                     * <quantity>        ::= <signedNumber><suffix>
                     *   (Note that <suffix> may be empty, from the "" case in <decimalSI>.)
                     * <digit>           ::= 0 | 1 | ... | 9 <digits>          ::= <digit> | <digit><digits> <number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> <sign>            ::= "+" | "-" <signedNumber>    ::= <number> | <sign><number> <suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> <binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei
                     *   (International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)
                     * <decimalSI>       ::= m | "" | k | M | G | T | P | E
                     *   (Note that 1024 = 1Ki but 1000 = 1k; I didn't choose the capitalization.)
                     * <decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber>
                     *
                     * No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.
                     *
                     * When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.
                     *
                     * Before serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:
                     *   a. No precision is lost
                     *   b. No fractional digits will be emitted
                     *   c. The exponent (or suffix) is as large as possible.
                     * The sign will be omitted unless the number is negative.
                     *
                     * Examples:
                     *   1.5 will be serialized as "1500m"
                     *   1.5Gi will be serialized as "1536Mi"
                     *
                     * Note that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.
                     *
                     * Non-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)
                     *
                     * This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.
                     */
                    IoK8sApimachineryPkgApiResourceQuantity;
                };
                /**
                 * Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
                 */
                requests?: {
                    [name: string]: /**
                     * Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.
                     *
                     * The serialization format is:
                     *
                     * <quantity>        ::= <signedNumber><suffix>
                     *   (Note that <suffix> may be empty, from the "" case in <decimalSI>.)
                     * <digit>           ::= 0 | 1 | ... | 9 <digits>          ::= <digit> | <digit><digits> <number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> <sign>            ::= "+" | "-" <signedNumber>    ::= <number> | <sign><number> <suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> <binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei
                     *   (International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)
                     * <decimalSI>       ::= m | "" | k | M | G | T | P | E
                     *   (Note that 1024 = 1Ki but 1000 = 1k; I didn't choose the capitalization.)
                     * <decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber>
                     *
                     * No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.
                     *
                     * When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.
                     *
                     * Before serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:
                     *   a. No precision is lost
                     *   b. No fractional digits will be emitted
                     *   c. The exponent (or suffix) is as large as possible.
                     * The sign will be omitted unless the number is negative.
                     *
                     * Examples:
                     *   1.5 will be serialized as "1500m"
                     *   1.5Gi will be serialized as "1536Mi"
                     *
                     * Note that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.
                     *
                     * Non-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)
                     *
                     * This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.
                     */
                    IoK8sApimachineryPkgApiResourceQuantity;
                };
            }
            /**
             * SELinuxOptions are the labels to be applied to the container
             */
            export interface IoK8sApiCoreV1SELinuxOptions {
                /**
                 * Level is SELinux level label that applies to the container.
                 */
                level?: string;
                /**
                 * Role is a SELinux role label that applies to the container.
                 */
                role?: string;
                /**
                 * Type is a SELinux type label that applies to the container.
                 */
                type?: string;
                /**
                 * User is a SELinux user label that applies to the container.
                 */
                user?: string;
            }
            /**
             * ScaleIOVolumeSource represents a persistent ScaleIO volume
             */
            export interface IoK8sApiCoreV1ScaleIOVolumeSource {
                /**
                 * Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Default is "xfs".
                 */
                fsType?: string;
                /**
                 * The host address of the ScaleIO API Gateway.
                 */
                gateway: string;
                /**
                 * The name of the ScaleIO Protection Domain for the configured storage.
                 */
                protectionDomain?: string;
                /**
                 * Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
                 */
                readOnly?: boolean;
                /**
                 * SecretRef references to the secret for ScaleIO user and other sensitive information. If this is not provided, Login operation will fail.
                 */
                secretRef: /* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */ IoK8sApiCoreV1LocalObjectReference;
                /**
                 * Flag to enable/disable SSL communication with Gateway, default false
                 */
                sslEnabled?: boolean;
                /**
                 * Indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned. Default is ThinProvisioned.
                 */
                storageMode?: string;
                /**
                 * The ScaleIO Storage Pool associated with the protection domain.
                 */
                storagePool?: string;
                /**
                 * The name of the storage system as configured in ScaleIO.
                 */
                system: string;
                /**
                 * The name of a volume already created in the ScaleIO system that is associated with this volume source.
                 */
                volumeName?: string;
            }
            /**
             * SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.
             */
            export interface IoK8sApiCoreV1SeccompProfile {
                /**
                 * localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must only be set if type is "Localhost".
                 */
                localhostProfile?: string;
                /**
                 * type indicates which kind of seccomp profile will be applied. Valid options are:
                 *
                 * Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.
                 *
                 * Possible enum values:
                 *  - `"Localhost"` indicates a profile defined in a file on the node should be used. The file's location relative to <kubelet-root-dir>/seccomp.
                 *  - `"RuntimeDefault"` represents the default container runtime seccomp profile.
                 *  - `"Unconfined"` indicates no seccomp profile is applied (A.K.A. unconfined).
                 */
                type: "Localhost" | "RuntimeDefault" | "Unconfined";
            }
            /**
             * SecretEnvSource selects a Secret to populate the environment variables with.
             *
             * The contents of the target Secret's Data field will represent the key-value pairs as environment variables.
             */
            export interface IoK8sApiCoreV1SecretEnvSource {
                /**
                 * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
                 */
                name?: string;
                /**
                 * Specify whether the Secret must be defined
                 */
                optional?: boolean;
            }
            /**
             * SecretKeySelector selects a key of a Secret.
             */
            export interface IoK8sApiCoreV1SecretKeySelector {
                /**
                 * The key of the secret to select from.  Must be a valid secret key.
                 */
                key: string;
                /**
                 * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
                 */
                name?: string;
                /**
                 * Specify whether the Secret or its key must be defined
                 */
                optional?: boolean;
            }
            /**
             * Adapts a secret into a projected volume.
             *
             * The contents of the target Secret's Data field will be presented in a projected volume as files using the keys in the Data field as the file names. Note that this is identical to a secret volume source without the default mode.
             */
            export interface IoK8sApiCoreV1SecretProjection {
                /**
                 * If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
                 */
                items?: /* Maps a string key to a path within a volume. */ IoK8sApiCoreV1KeyToPath[];
                /**
                 * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
                 */
                name?: string;
                /**
                 * Specify whether the Secret or its key must be defined
                 */
                optional?: boolean;
            }
            /**
             * Adapts a Secret into a volume.
             *
             * The contents of the target Secret's Data field will be presented in a volume as files using the keys in the Data field as the file names. Secret volumes support ownership management and SELinux relabeling.
             */
            export interface IoK8sApiCoreV1SecretVolumeSource {
                /**
                 * Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
                 */
                defaultMode?: number;
                /**
                 * If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
                 */
                items?: /* Maps a string key to a path within a volume. */ IoK8sApiCoreV1KeyToPath[];
                /**
                 * Specify whether the Secret or its keys must be defined
                 */
                optional?: boolean;
                /**
                 * Name of the secret in the pod's namespace to use. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret
                 */
                secretName?: string;
            }
            /**
             * SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence.
             */
            export interface IoK8sApiCoreV1SecurityContext {
                /**
                 * AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.
                 */
                allowPrivilegeEscalation?: boolean;
                /**
                 * The capabilities to add/drop when running containers. Defaults to the default set of capabilities granted by the container runtime. Note that this field cannot be set when spec.os.name is windows.
                 */
                capabilities?: /* Adds and removes POSIX capabilities from running containers. */ IoK8sApiCoreV1Capabilities;
                /**
                 * Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.
                 */
                privileged?: boolean;
                /**
                 * procMount denotes the type of proc mount to use for the containers. The default is DefaultProcMount which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. Note that this field cannot be set when spec.os.name is windows.
                 */
                procMount?: string;
                /**
                 * Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.
                 */
                readOnlyRootFilesystem?: boolean;
                /**
                 * The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
                 */
                runAsGroup?: number;
                /**
                 * Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
                 */
                runAsNonRoot?: boolean;
                /**
                 * The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
                 */
                runAsUser?: number;
                /**
                 * The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
                 */
                seLinuxOptions?: /* SELinuxOptions are the labels to be applied to the container */ IoK8sApiCoreV1SELinuxOptions;
                /**
                 * The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.
                 */
                seccompProfile?: /* SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set. */ IoK8sApiCoreV1SeccompProfile;
                /**
                 * The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.
                 */
                windowsOptions?: /* WindowsSecurityContextOptions contain Windows-specific options and credentials. */ IoK8sApiCoreV1WindowsSecurityContextOptions;
            }
            /**
             * ServiceAccountTokenProjection represents a projected service account token volume. This projection can be used to insert a service account token into the pods runtime filesystem for use against APIs (Kubernetes API Server or otherwise).
             */
            export interface IoK8sApiCoreV1ServiceAccountTokenProjection {
                /**
                 * Audience is the intended audience of the token. A recipient of a token must identify itself with an identifier specified in the audience of the token, and otherwise should reject the token. The audience defaults to the identifier of the apiserver.
                 */
                audience?: string;
                /**
                 * ExpirationSeconds is the requested duration of validity of the service account token. As the token approaches expiration, the kubelet volume plugin will proactively rotate the service account token. The kubelet will start trying to rotate the token if the token is older than 80 percent of its time to live or if the token is older than 24 hours.Defaults to 1 hour and must be at least 10 minutes.
                 */
                expirationSeconds?: number;
                /**
                 * Path is the path relative to the mount point of the file to project the token into.
                 */
                path: string;
            }
            /**
             * ServicePort contains information on service's port.
             */
            export interface IoK8sApiCoreV1ServicePort {
                /**
                 * The application protocol for this port. This field follows standard Kubernetes label syntax. Un-prefixed names are reserved for IANA standard service names (as per RFC-6335 and http://www.iana.org/assignments/service-names). Non-standard protocols should use prefixed names such as mycompany.com/my-custom-protocol.
                 */
                appProtocol?: string;
                /**
                 * The name of this port within the service. This must be a DNS_LABEL. All ports within a ServiceSpec must have unique names. When considering the endpoints for a Service, this must match the 'name' field in the EndpointPort. Optional if only one ServicePort is defined on this service.
                 */
                name?: string;
                /**
                 * The port on each node on which this service is exposed when type is NodePort or LoadBalancer.  Usually assigned by the system. If a value is specified, in-range, and not in use it will be used, otherwise the operation will fail.  If not specified, a port will be allocated if this Service requires one.  If this field is specified when creating a Service which does not need it, creation will fail. This field will be wiped when updating a Service to no longer need it (e.g. changing type from NodePort to ClusterIP). More info: https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport
                 */
                nodePort?: number;
                /**
                 * The port that will be exposed by this service.
                 */
                port: number;
                /**
                 * The IP protocol for this port. Supports "TCP", "UDP", and "SCTP". Default is TCP.
                 *
                 * Possible enum values:
                 *  - `"SCTP"` is the SCTP protocol.
                 *  - `"TCP"` is the TCP protocol.
                 *  - `"UDP"` is the UDP protocol.
                 */
                protocol?: "SCTP" | "TCP" | "UDP";
                /**
                 * Number or name of the port to access on the pods targeted by the service. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME. If this is a string, it will be looked up as a named port in the target Pod's container ports. If this is not specified, the value of the 'port' field is used (an identity map). This field is ignored for services with clusterIP=None, and should be omitted or set equal to the 'port' field. More info: https://kubernetes.io/docs/concepts/services-networking/service/#defining-a-service
                 */
                targetPort?: IoK8sApimachineryPkgUtilIntstrIntOrString;
            }
            /**
             * Represents a StorageOS persistent volume resource.
             */
            export interface IoK8sApiCoreV1StorageOSVolumeSource {
                /**
                 * Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
                 */
                fsType?: string;
                /**
                 * Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
                 */
                readOnly?: boolean;
                /**
                 * SecretRef specifies the secret to use for obtaining the StorageOS API credentials.  If not specified, default values will be attempted.
                 */
                secretRef?: /* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */ IoK8sApiCoreV1LocalObjectReference;
                /**
                 * VolumeName is the human-readable name of the StorageOS volume.  Volume names are only unique within a namespace.
                 */
                volumeName?: string;
                /**
                 * VolumeNamespace specifies the scope of the volume within StorageOS.  If no namespace is specified then the Pod's namespace will be used.  This allows the Kubernetes name scoping to be mirrored within StorageOS for tighter integration. Set VolumeName to any name to override the default behaviour. Set to "default" if you are not using namespaces within StorageOS. Namespaces that do not pre-exist within StorageOS will be created.
                 */
                volumeNamespace?: string;
            }
            /**
             * Sysctl defines a kernel parameter to be set
             */
            export interface IoK8sApiCoreV1Sysctl {
                /**
                 * Name of a property to set
                 */
                name: string;
                /**
                 * Value of a property to set
                 */
                value: string;
            }
            /**
             * TCPSocketAction describes an action based on opening a socket
             */
            export interface IoK8sApiCoreV1TCPSocketAction {
                /**
                 * Optional: Host name to connect to, defaults to the pod IP.
                 */
                host?: string;
                /**
                 * Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.
                 */
                port: IoK8sApimachineryPkgUtilIntstrIntOrString;
            }
            /**
             * The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.
             */
            export interface IoK8sApiCoreV1Toleration {
                /**
                 * Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.
                 *
                 * Possible enum values:
                 *  - `"NoExecute"` Evict any already-running pods that do not tolerate the taint. Currently enforced by NodeController.
                 *  - `"NoSchedule"` Do not allow new pods to schedule onto the node unless they tolerate the taint, but allow all pods submitted to Kubelet without going through the scheduler to start, and allow all already-running pods to continue running. Enforced by the scheduler.
                 *  - `"PreferNoSchedule"` Like TaintEffectNoSchedule, but the scheduler tries not to schedule new pods onto the node, rather than prohibiting new pods from scheduling onto the node entirely. Enforced by the scheduler.
                 */
                effect?: "NoExecute" | "NoSchedule" | "PreferNoSchedule";
                /**
                 * Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys.
                 */
                key?: string;
                /**
                 * Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category.
                 *
                 * Possible enum values:
                 *  - `"Equal"`
                 *  - `"Exists"`
                 */
                operator?: "Equal" | "Exists";
                /**
                 * TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system.
                 */
                tolerationSeconds?: number;
                /**
                 * Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string.
                 */
                value?: string;
            }
            /**
             * TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace.
             */
            export interface IoK8sApiCoreV1TypedLocalObjectReference {
                /**
                 * APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.
                 */
                apiGroup?: string;
                /**
                 * Kind is the type of resource being referenced
                 */
                kind: string;
                /**
                 * Name is the name of resource being referenced
                 */
                name: string;
            }
            /**
             * Volume represents a named volume in a pod that may be accessed by any container in the pod.
             */
            export interface IoK8sApiCoreV1Volume {
                /**
                 * AWSElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
                 */
                awsElasticBlockStore?: /**
                 * Represents a Persistent Disk resource in AWS.
                 *
                 * An AWS EBS disk must exist before mounting to a container. The disk must also be in the same AWS zone as the kubelet. An AWS EBS disk can only be mounted as read/write once. AWS EBS volumes support ownership management and SELinux relabeling.
                 */
                IoK8sApiCoreV1AWSElasticBlockStoreVolumeSource;
                /**
                 * AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.
                 */
                azureDisk?: /* AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod. */ IoK8sApiCoreV1AzureDiskVolumeSource;
                /**
                 * AzureFile represents an Azure File Service mount on the host and bind mount to the pod.
                 */
                azureFile?: /* AzureFile represents an Azure File Service mount on the host and bind mount to the pod. */ IoK8sApiCoreV1AzureFileVolumeSource;
                /**
                 * CephFS represents a Ceph FS mount on the host that shares a pod's lifetime
                 */
                cephfs?: /* Represents a Ceph Filesystem mount that lasts the lifetime of a pod Cephfs volumes do not support ownership management or SELinux relabeling. */ IoK8sApiCoreV1CephFSVolumeSource;
                /**
                 * Cinder represents a cinder volume attached and mounted on kubelets host machine. More info: https://examples.k8s.io/mysql-cinder-pd/README.md
                 */
                cinder?: /* Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling. */ IoK8sApiCoreV1CinderVolumeSource;
                /**
                 * ConfigMap represents a configMap that should populate this volume
                 */
                configMap?: /**
                 * Adapts a ConfigMap into a volume.
                 *
                 * The contents of the target ConfigMap's Data field will be presented in a volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. ConfigMap volumes support ownership management and SELinux relabeling.
                 */
                IoK8sApiCoreV1ConfigMapVolumeSource;
                /**
                 * CSI (Container Storage Interface) represents ephemeral storage that is handled by certain external CSI drivers (Beta feature).
                 */
                csi?: /* Represents a source location of a volume to mount, managed by an external CSI driver */ IoK8sApiCoreV1CSIVolumeSource;
                /**
                 * DownwardAPI represents downward API about the pod that should populate this volume
                 */
                downwardAPI?: /* DownwardAPIVolumeSource represents a volume containing downward API info. Downward API volumes support ownership management and SELinux relabeling. */ IoK8sApiCoreV1DownwardAPIVolumeSource;
                /**
                 * EmptyDir represents a temporary directory that shares a pod's lifetime. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir
                 */
                emptyDir?: /* Represents an empty directory for a pod. Empty directory volumes support ownership management and SELinux relabeling. */ IoK8sApiCoreV1EmptyDirVolumeSource;
                /**
                 * Ephemeral represents a volume that is handled by a cluster storage driver. The volume's lifecycle is tied to the pod that defines it - it will be created before the pod starts, and deleted when the pod is removed.
                 *
                 * Use this if: a) the volume is only needed while the pod runs, b) features of normal volumes like restoring from snapshot or capacity
                 *    tracking are needed,
                 * c) the storage driver is specified through a storage class, and d) the storage driver supports dynamic volume provisioning through
                 *    a PersistentVolumeClaim (see EphemeralVolumeSource for more
                 *    information on the connection between this volume type
                 *    and PersistentVolumeClaim).
                 *
                 * Use PersistentVolumeClaim or one of the vendor-specific APIs for volumes that persist for longer than the lifecycle of an individual pod.
                 *
                 * Use CSI for light-weight local ephemeral volumes if the CSI driver is meant to be used that way - see the documentation of the driver for more information.
                 *
                 * A pod can use both types of ephemeral volumes and persistent volumes at the same time.
                 */
                ephemeral?: /* Represents an ephemeral volume that is handled by a normal storage driver. */ IoK8sApiCoreV1EphemeralVolumeSource;
                /**
                 * FC represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.
                 */
                fc?: /* Represents a Fibre Channel volume. Fibre Channel volumes can only be mounted as read/write once. Fibre Channel volumes support ownership management and SELinux relabeling. */ IoK8sApiCoreV1FCVolumeSource;
                /**
                 * FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin.
                 */
                flexVolume?: /* FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. */ IoK8sApiCoreV1FlexVolumeSource;
                /**
                 * Flocker represents a Flocker volume attached to a kubelet's host machine. This depends on the Flocker control service being running
                 */
                flocker?: /* Represents a Flocker volume mounted by the Flocker agent. One and only one of datasetName and datasetUUID should be set. Flocker volumes do not support ownership management or SELinux relabeling. */ IoK8sApiCoreV1FlockerVolumeSource;
                /**
                 * GCEPersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
                 */
                gcePersistentDisk?: /**
                 * Represents a Persistent Disk resource in Google Compute Engine.
                 *
                 * A GCE PD must exist before mounting to a container. The disk must also be in the same GCE project and zone as the kubelet. A GCE PD can only be mounted as read/write once or read-only many times. GCE PDs support ownership management and SELinux relabeling.
                 */
                IoK8sApiCoreV1GCEPersistentDiskVolumeSource;
                /**
                 * GitRepo represents a git repository at a particular revision. DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.
                 */
                gitRepo?: /**
                 * Represents a volume that is populated with the contents of a git repository. Git repo volumes do not support ownership management. Git repo volumes support SELinux relabeling.
                 *
                 * DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.
                 */
                IoK8sApiCoreV1GitRepoVolumeSource;
                /**
                 * Glusterfs represents a Glusterfs mount on the host that shares a pod's lifetime. More info: https://examples.k8s.io/volumes/glusterfs/README.md
                 */
                glusterfs?: /* Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling. */ IoK8sApiCoreV1GlusterfsVolumeSource;
                /**
                 * HostPath represents a pre-existing file or directory on the host machine that is directly exposed to the container. This is generally used for system agents or other privileged things that are allowed to see the host machine. Most containers will NOT need this. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath
                 */
                hostPath?: /* Represents a host path mapped into a pod. Host path volumes do not support ownership management or SELinux relabeling. */ IoK8sApiCoreV1HostPathVolumeSource;
                /**
                 * ISCSI represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://examples.k8s.io/volumes/iscsi/README.md
                 */
                iscsi?: /* Represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling. */ IoK8sApiCoreV1ISCSIVolumeSource;
                /**
                 * Volume's name. Must be a DNS_LABEL and unique within the pod. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
                 */
                name: string;
                /**
                 * NFS represents an NFS mount on the host that shares a pod's lifetime More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
                 */
                nfs?: /* Represents an NFS mount that lasts the lifetime of a pod. NFS volumes do not support ownership management or SELinux relabeling. */ IoK8sApiCoreV1NFSVolumeSource;
                /**
                 * PersistentVolumeClaimVolumeSource represents a reference to a PersistentVolumeClaim in the same namespace. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
                 */
                persistentVolumeClaim?: /* PersistentVolumeClaimVolumeSource references the user's PVC in the same namespace. This volume finds the bound PV and mounts that volume for the pod. A PersistentVolumeClaimVolumeSource is, essentially, a wrapper around another type of volume that is owned by someone else (the system). */ IoK8sApiCoreV1PersistentVolumeClaimVolumeSource;
                /**
                 * PhotonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine
                 */
                photonPersistentDisk?: /* Represents a Photon Controller persistent disk resource. */ IoK8sApiCoreV1PhotonPersistentDiskVolumeSource;
                /**
                 * PortworxVolume represents a portworx volume attached and mounted on kubelets host machine
                 */
                portworxVolume?: /* PortworxVolumeSource represents a Portworx volume resource. */ IoK8sApiCoreV1PortworxVolumeSource;
                /**
                 * Items for all in one resources secrets, configmaps, and downward API
                 */
                projected?: /* Represents a projected volume source */ IoK8sApiCoreV1ProjectedVolumeSource;
                /**
                 * Quobyte represents a Quobyte mount on the host that shares a pod's lifetime
                 */
                quobyte?: /* Represents a Quobyte mount that lasts the lifetime of a pod. Quobyte volumes do not support ownership management or SELinux relabeling. */ IoK8sApiCoreV1QuobyteVolumeSource;
                /**
                 * RBD represents a Rados Block Device mount on the host that shares a pod's lifetime. More info: https://examples.k8s.io/volumes/rbd/README.md
                 */
                rbd?: /* Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling. */ IoK8sApiCoreV1RBDVolumeSource;
                /**
                 * ScaleIO represents a ScaleIO persistent volume attached and mounted on Kubernetes nodes.
                 */
                scaleIO?: /* ScaleIOVolumeSource represents a persistent ScaleIO volume */ IoK8sApiCoreV1ScaleIOVolumeSource;
                /**
                 * Secret represents a secret that should populate this volume. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret
                 */
                secret?: /**
                 * Adapts a Secret into a volume.
                 *
                 * The contents of the target Secret's Data field will be presented in a volume as files using the keys in the Data field as the file names. Secret volumes support ownership management and SELinux relabeling.
                 */
                IoK8sApiCoreV1SecretVolumeSource;
                /**
                 * StorageOS represents a StorageOS volume attached and mounted on Kubernetes nodes.
                 */
                storageos?: /* Represents a StorageOS persistent volume resource. */ IoK8sApiCoreV1StorageOSVolumeSource;
                /**
                 * VsphereVolume represents a vSphere volume attached and mounted on kubelets host machine
                 */
                vsphereVolume?: /* Represents a vSphere volume resource. */ IoK8sApiCoreV1VsphereVirtualDiskVolumeSource;
            }
            /**
             * volumeDevice describes a mapping of a raw block device within a container.
             */
            export interface IoK8sApiCoreV1VolumeDevice {
                /**
                 * devicePath is the path inside of the container that the device will be mapped to.
                 */
                devicePath: string;
                /**
                 * name must match the name of a persistentVolumeClaim in the pod
                 */
                name: string;
            }
            /**
             * VolumeMount describes a mounting of a Volume within a container.
             */
            export interface IoK8sApiCoreV1VolumeMount {
                /**
                 * Path within the container at which the volume should be mounted.  Must not contain ':'.
                 */
                mountPath: string;
                /**
                 * mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10.
                 */
                mountPropagation?: string;
                /**
                 * This must match the Name of a Volume.
                 */
                name: string;
                /**
                 * Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.
                 */
                readOnly?: boolean;
                /**
                 * Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).
                 */
                subPath?: string;
                /**
                 * Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive.
                 */
                subPathExpr?: string;
            }
            /**
             * Projection that may be projected along with other supported volume types
             */
            export interface IoK8sApiCoreV1VolumeProjection {
                /**
                 * information about the configMap data to project
                 */
                configMap?: /**
                 * Adapts a ConfigMap into a projected volume.
                 *
                 * The contents of the target ConfigMap's Data field will be presented in a projected volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. Note that this is identical to a configmap volume source without the default mode.
                 */
                IoK8sApiCoreV1ConfigMapProjection;
                /**
                 * information about the downwardAPI data to project
                 */
                downwardAPI?: /* Represents downward API info for projecting into a projected volume. Note that this is identical to a downwardAPI volume source without the default mode. */ IoK8sApiCoreV1DownwardAPIProjection;
                /**
                 * information about the secret data to project
                 */
                secret?: /**
                 * Adapts a secret into a projected volume.
                 *
                 * The contents of the target Secret's Data field will be presented in a projected volume as files using the keys in the Data field as the file names. Note that this is identical to a secret volume source without the default mode.
                 */
                IoK8sApiCoreV1SecretProjection;
                /**
                 * information about the serviceAccountToken data to project
                 */
                serviceAccountToken?: /* ServiceAccountTokenProjection represents a projected service account token volume. This projection can be used to insert a service account token into the pods runtime filesystem for use against APIs (Kubernetes API Server or otherwise). */ IoK8sApiCoreV1ServiceAccountTokenProjection;
            }
            /**
             * Represents a vSphere volume resource.
             */
            export interface IoK8sApiCoreV1VsphereVirtualDiskVolumeSource {
                /**
                 * Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
                 */
                fsType?: string;
                /**
                 * Storage Policy Based Management (SPBM) profile ID associated with the StoragePolicyName.
                 */
                storagePolicyID?: string;
                /**
                 * Storage Policy Based Management (SPBM) profile name.
                 */
                storagePolicyName?: string;
                /**
                 * Path that identifies vSphere volume vmdk
                 */
                volumePath: string;
            }
            /**
             * The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)
             */
            export interface IoK8sApiCoreV1WeightedPodAffinityTerm {
                /**
                 * Required. A pod affinity term, associated with the corresponding weight.
                 */
                podAffinityTerm: /* Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running */ IoK8sApiCoreV1PodAffinityTerm;
                /**
                 * weight associated with matching the corresponding podAffinityTerm, in the range 1-100.
                 */
                weight: number;
            }
            /**
             * WindowsSecurityContextOptions contain Windows-specific options and credentials.
             */
            export interface IoK8sApiCoreV1WindowsSecurityContextOptions {
                /**
                 * GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.
                 */
                gmsaCredentialSpec?: string;
                /**
                 * GMSACredentialSpecName is the name of the GMSA credential spec to use.
                 */
                gmsaCredentialSpecName?: string;
                /**
                 * HostProcess determines if a container should be run as a 'Host Process' container. This field is alpha-level and will only be honored by components that enable the WindowsHostProcessContainers feature flag. Setting this field without the feature flag will result in errors when validating the Pod. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers).  In addition, if HostProcess is true then HostNetwork must also be set to true.
                 */
                hostProcess?: boolean;
                /**
                 * The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
                 */
                runAsUserName?: string;
            }
            /**
             * PodDisruptionBudgetSpec is a description of a PodDisruptionBudget.
             */
            export interface IoK8sApiPolicyV1PodDisruptionBudgetSpec {
                /**
                 * An eviction is allowed if at most "maxUnavailable" pods selected by "selector" are unavailable after the eviction, i.e. even in absence of the evicted pod. For example, one can prevent all voluntary evictions by specifying 0. This is a mutually exclusive setting with "minAvailable".
                 */
                maxUnavailable?: IoK8sApimachineryPkgUtilIntstrIntOrString;
                /**
                 * An eviction is allowed if at least "minAvailable" pods selected by "selector" will still be available after the eviction, i.e. even in the absence of the evicted pod.  So for example you can prevent all voluntary evictions by specifying "100%".
                 */
                minAvailable?: IoK8sApimachineryPkgUtilIntstrIntOrString;
                /**
                 * Label query over pods whose evictions are managed by the disruption budget. A null selector will match no pods, while an empty ({}) selector will select all pods within the namespace.
                 */
                selector?: /* A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects. */ IoK8sApimachineryPkgApisMetaV1LabelSelector;
            }
            /**
             * Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.
             *
             * The serialization format is:
             *
             * <quantity>        ::= <signedNumber><suffix>
             *   (Note that <suffix> may be empty, from the "" case in <decimalSI>.)
             * <digit>           ::= 0 | 1 | ... | 9 <digits>          ::= <digit> | <digit><digits> <number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> <sign>            ::= "+" | "-" <signedNumber>    ::= <number> | <sign><number> <suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> <binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei
             *   (International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)
             * <decimalSI>       ::= m | "" | k | M | G | T | P | E
             *   (Note that 1024 = 1Ki but 1000 = 1k; I didn't choose the capitalization.)
             * <decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber>
             *
             * No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.
             *
             * When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.
             *
             * Before serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:
             *   a. No precision is lost
             *   b. No fractional digits will be emitted
             *   c. The exponent (or suffix) is as large as possible.
             * The sign will be omitted unless the number is negative.
             *
             * Examples:
             *   1.5 will be serialized as "1500m"
             *   1.5Gi will be serialized as "1536Mi"
             *
             * Note that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.
             *
             * Non-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)
             *
             * This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.
             */
            export type IoK8sApimachineryPkgApiResourceQuantity = string;
            /**
             * CreateOptions may be provided when creating an API object.
             */
            export interface IoK8sApimachineryPkgApisMetaV1CreateOptions {
                /**
                 * When present, indicates that modifications should not be
                 * persisted. An invalid or unrecognized dryRun directive will
                 * result in an error response and no further processing of the
                 * request. Valid values are:
                 * - All: all dry run stages will be processed
                 * +optional
                 */
                dryRun?: string[];
                /**
                 * fieldManager is a name associated with the actor or entity
                 * that is making these changes. The value must be less than or
                 * 128 characters long, and only contain printable characters,
                 * as defined by https://golang.org/pkg/unicode/#IsPrint.
                 * +optional
                 */
                fieldManager?: string;
                /**
                 * fieldValidation instructs the server on how to handle
                 * objects in the request (POST/PUT/PATCH) containing unknown
                 * or duplicate fields, provided that the `ServerSideFieldValidation`
                 * feature gate is also enabled. Valid values are:
                 * - Ignore: This will ignore any unknown fields that are silently
                 * dropped from the object, and will ignore all but the last duplicate
                 * field that the decoder encounters. This is the default behavior
                 * prior to v1.23 and is the default behavior when the
                 * `ServerSideFieldValidation` feature gate is disabled.
                 * - Warn: This will send a warning via the standard warning response
                 * header for each unknown field that is dropped from the object, and
                 * for each duplicate field that is encountered. The request will
                 * still succeed if there are no other errors, and will only persist
                 * the last of any duplicate fields. This is the default when the
                 * `ServerSideFieldValidation` feature gate is enabled.
                 * - Strict: This will fail the request with a BadRequest error if
                 * any unknown fields would be dropped from the object, or if any
                 * duplicate fields are present. The error returned from the server
                 * will contain all unknown and duplicate fields encountered.
                 * +optional
                 */
                fieldValidation?: string;
            }
            /**
             * FieldsV1 stores a set of fields in a data structure like a Trie, in JSON format.
             *
             * Each key is either a '.' representing the field itself, and will always map to an empty set, or a string representing a sub-field or item. The string will follow one of these four formats: 'f:<name>', where <name> is the name of a field in a struct, or key in a map 'v:<value>', where <value> is the exact json formatted value of a list item 'i:<index>', where <index> is position of a item in a list 'k:<keys>', where <keys> is a map of  a list item's key fields to their unique values If a key maps to an empty Fields value, the field that key represents is part of the set.
             *
             * The exact format is defined in sigs.k8s.io/structured-merge-diff
             */
            export interface IoK8sApimachineryPkgApisMetaV1FieldsV1 {
            }
            /**
             * GroupVersionResource unambiguously identifies a resource.  It doesn't anonymously include GroupVersion
             * to avoid automatic coercion.  It doesn't use a GroupVersion to avoid custom marshalling
             * +protobuf.options.(gogoproto.goproto_stringer)=false
             */
            export interface IoK8sApimachineryPkgApisMetaV1GroupVersionResource {
                group?: string;
                resource?: string;
                version?: string;
            }
            /**
             * A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects.
             */
            export interface IoK8sApimachineryPkgApisMetaV1LabelSelector {
                /**
                 * matchExpressions is a list of label selector requirements. The requirements are ANDed.
                 */
                matchExpressions?: /* A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values. */ IoK8sApimachineryPkgApisMetaV1LabelSelectorRequirement[];
                /**
                 * matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed.
                 */
                matchLabels?: {
                    [name: string]: string;
                };
            }
            /**
             * A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.
             */
            export interface IoK8sApimachineryPkgApisMetaV1LabelSelectorRequirement {
                /**
                 * key is the label key that the selector applies to.
                 */
                key: string;
                /**
                 * operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.
                 */
                operator: string;
                /**
                 * values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.
                 */
                values?: string[];
            }
            /**
             * ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.
             */
            export interface IoK8sApimachineryPkgApisMetaV1ListMeta {
                /**
                 * continue may be set if the user set a limit on the number of items returned, and indicates that the server has more data available. The value is opaque and may be used to issue another request to the endpoint that served this list to retrieve the next set of available objects. Continuing a consistent list may not be possible if the server configuration has changed or more than a few minutes have passed. The resourceVersion field returned when using this continue value will be identical to the value in the first response, unless you have received this token from an error message.
                 */
                continue?: string;
                /**
                 * remainingItemCount is the number of subsequent items in the list which are not included in this list response. If the list request contained label or field selectors, then the number of remaining items is unknown and the field will be left unset and omitted during serialization. If the list is complete (either because it is not chunking or because this is the last chunk), then there are no more remaining items and this field will be left unset and omitted during serialization. Servers older than v1.15 do not set this field. The intended use of the remainingItemCount is *estimating* the size of a collection. Clients should not rely on the remainingItemCount to be set or to be exact.
                 */
                remainingItemCount?: number;
                /**
                 * String that identifies the server's internal version of this object that can be used by clients to determine when objects have changed. Value must be treated as opaque by clients and passed unmodified back to the server. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
                 */
                resourceVersion?: string;
                /**
                 * selfLink is a URL representing this object. Populated by the system. Read-only.
                 *
                 * DEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release.
                 */
                selfLink?: string;
            }
            /**
             * ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to.
             */
            export interface IoK8sApimachineryPkgApisMetaV1ManagedFieldsEntry {
                /**
                 * APIVersion defines the version of this resource that this field set applies to. The format is "group/version" just like the top-level APIVersion field. It is necessary to track the version of a field set because it cannot be automatically converted.
                 */
                apiVersion?: string;
                /**
                 * FieldsType is the discriminator for the different fields format and version. There is currently only one possible value: "FieldsV1"
                 */
                fieldsType?: string;
                /**
                 * FieldsV1 holds the first JSON version format as described in the "FieldsV1" type.
                 */
                fieldsV1?: /**
                 * FieldsV1 stores a set of fields in a data structure like a Trie, in JSON format.
                 *
                 * Each key is either a '.' representing the field itself, and will always map to an empty set, or a string representing a sub-field or item. The string will follow one of these four formats: 'f:<name>', where <name> is the name of a field in a struct, or key in a map 'v:<value>', where <value> is the exact json formatted value of a list item 'i:<index>', where <index> is position of a item in a list 'k:<keys>', where <keys> is a map of  a list item's key fields to their unique values If a key maps to an empty Fields value, the field that key represents is part of the set.
                 *
                 * The exact format is defined in sigs.k8s.io/structured-merge-diff
                 */
                IoK8sApimachineryPkgApisMetaV1FieldsV1;
                /**
                 * Manager is an identifier of the workflow managing these fields.
                 */
                manager?: string;
                /**
                 * Operation is the type of operation which lead to this ManagedFieldsEntry being created. The only valid values for this field are 'Apply' and 'Update'.
                 */
                operation?: string;
                /**
                 * Subresource is the name of the subresource used to update that object, or empty string if the object was updated through the main resource. The value of this field is used to distinguish between managers, even if they share the same name. For example, a status update will be distinct from a regular update using the same manager name. Note that the APIVersion field is not related to the Subresource field and it always corresponds to the version of the main resource.
                 */
                subresource?: string;
                /**
                 * Time is timestamp of when these fields were set. It should always be empty if Operation is 'Apply'
                 */
                time?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
            }
            /**
             * MicroTime is version of Time with microsecond level precision.
             */
            export type IoK8sApimachineryPkgApisMetaV1MicroTime = string; // date-time
            /**
             * ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create.
             */
            export interface IoK8sApimachineryPkgApisMetaV1ObjectMeta {
                /**
                 * Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: http://kubernetes.io/docs/user-guide/annotations
                 */
                annotations?: {
                    [name: string]: string;
                };
                /**
                 * The name of the cluster which the object belongs to. This is used to distinguish resources with same name and namespace in different clusters. This field is not set anywhere right now and apiserver is going to ignore it if set in create or update request.
                 */
                clusterName?: string;
                /**
                 * CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.
                 *
                 * Populated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
                 */
                creationTimestamp?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * Number of seconds allowed for this object to gracefully terminate before it will be removed from the system. Only set when deletionTimestamp is also set. May only be shortened. Read-only.
                 */
                deletionGracePeriodSeconds?: number;
                /**
                 * DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted. This field is set by the server when a graceful deletion is requested by the user, and is not directly settable by a client. The resource is expected to be deleted (no longer visible from resource lists, and not reachable by name) after the time in this field, once the finalizers list is empty. As long as the finalizers list contains items, deletion is blocked. Once the deletionTimestamp is set, this value may not be unset or be set further into the future, although it may be shortened or the resource may be deleted prior to this time. For example, a user may request that a pod is deleted in 30 seconds. The Kubelet will react by sending a graceful termination signal to the containers in the pod. After that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL) to the container and after cleanup, remove the pod from the API. In the presence of network partitions, this object may still exist after this timestamp, until an administrator or automated process can determine the resource is fully terminated. If not set, graceful deletion of the object has not been requested.
                 *
                 * Populated by the system when a graceful deletion is requested. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
                 */
                deletionTimestamp?: /* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */ IoK8sApimachineryPkgApisMetaV1Time /* date-time */;
                /**
                 * Must be empty before the object is deleted from the registry. Each entry is an identifier for the responsible component that will remove the entry from the list. If the deletionTimestamp of the object is non-nil, entries in this list can only be removed. Finalizers may be processed and removed in any order.  Order is NOT enforced because it introduces significant risk of stuck finalizers. finalizers is a shared field, any actor with permission can reorder it. If the finalizer list is processed in order, then this can lead to a situation in which the component responsible for the first finalizer in the list is waiting for a signal (field value, external system, or other) produced by a component responsible for a finalizer later in the list, resulting in a deadlock. Without enforced ordering finalizers are free to order amongst themselves and are not vulnerable to ordering changes in the list.
                 */
                finalizers?: string[];
                /**
                 * GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided. If this field is used, the name returned to the client will be different than the name passed. This value will also be combined with a unique suffix. The provided value has the same validation rules as the Name field, and may be truncated by the length of the suffix required to make the value unique on the server.
                 *
                 * If this field is specified and the generated name exists, the server will NOT return a 409 - instead, it will either return 201 Created or 500 with Reason ServerTimeout indicating a unique name could not be found in the time allotted, and the client should retry (optionally after the time indicated in the Retry-After header).
                 *
                 * Applied only if Name is not specified. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency
                 */
                generateName?: string;
                /**
                 * A sequence number representing a specific generation of the desired state. Populated by the system. Read-only.
                 */
                generation?: number;
                /**
                 * Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and services. More info: http://kubernetes.io/docs/user-guide/labels
                 */
                labels?: {
                    [name: string]: string;
                };
                /**
                 * ManagedFields maps workflow-id and version to the set of fields that are managed by that workflow. This is mostly for internal housekeeping, and users typically shouldn't need to set or understand this field. A workflow can be the user's name, a controller's name, or the name of a specific apply path like "ci-cd". The set of fields is always in the version that the workflow used when modifying the object.
                 */
                managedFields?: /* ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to. */ IoK8sApimachineryPkgApisMetaV1ManagedFieldsEntry[];
                /**
                 * Name must be unique within a namespace. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/identifiers#names
                 */
                name?: string;
                /**
                 * Namespace defines the space within which each name must be unique. An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation. Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.
                 *
                 * Must be a DNS_LABEL. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/namespaces
                 */
                namespace?: string;
                /**
                 * List of objects depended by this object. If ALL objects in the list have been deleted, this object will be garbage collected. If this object is managed by a controller, then an entry in this list will point to this controller, with the controller field set to true. There cannot be more than one managing controller.
                 */
                ownerReferences?: /* OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field. */ IoK8sApimachineryPkgApisMetaV1OwnerReference[];
                /**
                 * An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed. May be used for optimistic concurrency, change detection, and the watch operation on a resource or set of resources. Clients must treat these values as opaque and passed unmodified back to the server. They may only be valid for a particular resource or set of resources.
                 *
                 * Populated by the system. Read-only. Value must be treated as opaque by clients and . More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
                 */
                resourceVersion?: string;
                /**
                 * SelfLink is a URL representing this object. Populated by the system. Read-only.
                 *
                 * DEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release.
                 */
                selfLink?: string;
                /**
                 * UID is the unique in time and space value for this object. It is typically generated by the server on successful creation of a resource and is not allowed to change on PUT operations.
                 *
                 * Populated by the system. Read-only. More info: http://kubernetes.io/docs/user-guide/identifiers#uids
                 */
                uid?: string;
            }
            /**
             * OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field.
             */
            export interface IoK8sApimachineryPkgApisMetaV1OwnerReference {
                /**
                 * API version of the referent.
                 */
                apiVersion: string;
                /**
                 * If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed. Defaults to false. To set this field, a user needs "delete" permission of the owner, otherwise 422 (Unprocessable Entity) will be returned.
                 */
                blockOwnerDeletion?: boolean;
                /**
                 * If true, this reference points to the managing controller.
                 */
                controller?: boolean;
                /**
                 * Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
                 */
                kind: string;
                /**
                 * Name of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#names
                 */
                name: string;
                /**
                 * UID of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#uids
                 */
                uid: string;
            }
            /**
             * Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.
             */
            export type IoK8sApimachineryPkgApisMetaV1Time = string; // date-time
            export type IoK8sApimachineryPkgUtilIntstrIntOrString = string;
        }
    }
}
