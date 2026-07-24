<template>
  <div class="app-container">
    <p class="warn-content">
      Yaml编辑器 基于
      <a href="https://github.com/codemirror/CodeMirror" target="_blank">CodeMirror</a>，
      主题预览地址 <a href="https://codemirror.net/demo/theme.html#idea" target="_blank">Theme</a>
    </p>
    <Yaml :value="value" :height="height" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Yaml from '@/components/YamlEdit/index'

const height = ref(document.documentElement.clientHeight - 210 + 'px')
const value = `# 展示数据，如需更换主题，请在src/components/YamlEdit 目录中搜索原主题名称进行替换

# ===================================================================
# Spring Boot configuration.
#
# This configuration will be overridden by the Spring profile you use,
# for example application-dev.yml if you use the "dev" profile.
#
# More information on profiles: https://www.jhipster.tech/profiles/
# More information on configuration properties: https://www.jhipster.tech/common-application-properties/
# ===================================================================

# ===================================================================
# Standard Spring Boot properties.
# Full reference is available at:
# http://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html
# ===================================================================

eureka:
    client:
        enabled: true
        healthcheck:
            enabled: true
        fetch-registry: true
        register-with-eureka: true
        instance-info-replication-interval-seconds: 10
        registry-fetch-interval-seconds: 10
    instance:
        appname: product
        instanceId: product:\${spring.application.instance-id:\${random.value}}
        #instanceId: 127.0.0.1:9080
        lease-renewal-interval-in-seconds: 5
        lease-expiration-duration-in-seconds: 10
        status-page-url-path: \${management.endpoints.web.base-path}/info
        health-check-url-path: \${management.endpoints.web.base-path}/health
        metadata-map:
            zone: primary # This is needed for the load balancer
            profile: \${spring.profiles.active}
            version: \${info.project.version:}
            git-version: \${git.commit.id.describe:}
            git-commit: \${git.commit.id.abbrev:}
            git-branch: \${git.branch:}
ribbon:
    ReadTimeout: 120000
    ConnectTimeout: 300000
    eureka:
        enabled: true
zuul:
  host:
    connect-timeout-millis: 5000
    max-per-route-connections: 10000
    max-total-connections: 5000
    socket-timeout-millis: 60000
  semaphore:
    max-semaphores: 500

feign:
    hystrix:
        enabled: true
    client:
        config:
            default:
                connectTimeout: 500000
                readTimeout: 500000

# See https://github.com/Netflix/Hystrix/wiki/Configuration
hystrix:
    command:
        default:
            circuitBreaker:
                sleepWindowInMilliseconds: 100000
                forceClosed: true
            execution:
                isolation:
#                    strategy: SEMAPHORE
# See https://github.com/spring-cloud/spring-cloud-netflix/issues/1330
                    thread:
                        timeoutInMilliseconds: 60000
    shareSecurityContext: true

management:
    endpoints:
        web:
            base-path: /management
            exposure:
                include: ["configprops", "env", "health", "info", "threaddump"]
    endpoint:
        health:
            show-details: when_authorized
    info:
        git:
            mode: full
    health:
        mail:
            enabled: false # When using the MailService, configure an SMTP server and set this to true
    metrics:
        enabled: false # http://micrometer.io/ is disabled by default, as we use http://metrics.dropwizard.io/ instead

spring:
    application:
        name: product
    jpa:
        open-in-view: false
        hibernate:
            ddl-auto: update
            naming:
                physical-strategy: org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy
                implicit-strategy: org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy
    messages:
        basename: i18n/messages
    mvc:
        favicon:
            enabled: false
    thymeleaf:
        mode: HTML
security:
    oauth2:
        resource:
            filter-order: 3

server:
    servlet:
        session:
            cookie:
                http-only: true

# Properties to be exposed on the /info management endpoint
info:
    # Comma separated list of profiles that will trigger the ribbon to show
    display-ribbon-on-profiles: "dev"

# ===================================================================
# JHipster specific properties
#
# Full reference is available at: https://www.jhipster.tech/common-application-properties/
# ===================================================================

jhipster:
    async:
        core-pool-size: 2
        max-pool-size: 50
        queue-capacity: 10000
    # By default CORS is disabled. Uncomment to enable.
    #cors:
        #allowed-origins: "*"
        #allowed-methods: "*"
        #allowed-headers: "*"
        #exposed-headers: "Authorization,Link,X-Total-Count"
        #allow-credentials: true
        #max-age: 1800
    mail:
        from: product@localhost
    swagger:
        default-include-pattern: /api/.*
        title: product API
        description: product API documentation
        version: 0.0.1
        terms-of-service-url:
        contact-name:
        contact-url:
        contact-email:
        license:
        license-url:

# ===================================================================
# Application specific properties
# Add your own application properties here, see the ApplicationProperties class
# to have type-safe configuration, like in the JHipsterProperties above
#
# More documentation is available at:
# https://www.jhipster.tech/common-application-properties/
# ===================================================================

# application:`

onMounted(() => {
  window.onresize = () => {
    height.value = document.documentElement.clientHeight - 210 + 'px'
  }
})
</script>

<style scoped>
</style>
