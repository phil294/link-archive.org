package phil294.ls.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import phil294.ls.api.auth.AuthenticatorInterceptor;
import phil294.ls.api.auth.OptionalAuthenticationInterceptor;


/**
 * User: phi
 * Date: 17.02.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter
{
	@Override
	public void addInterceptors(InterceptorRegistry registry)
	{
		registry.addInterceptor(
				//new AuthenticatorInterceptor()
				getAuthenticatorInterceptor()
				).addPathPatterns("/profile/**"); // todo
		registry.addInterceptor(
				getOptionalAuthenticationInterceptor()
				).addPathPatterns("/product/**");
	}
	@Bean
	public AuthenticatorInterceptor getAuthenticatorInterceptor() {
		return new AuthenticatorInterceptor();
	}
	@Bean
	public OptionalAuthenticationInterceptor getOptionalAuthenticationInterceptor() {
		return new OptionalAuthenticationInterceptor();
	}
	/*
	@Bean
	public SessionFactory sessionFactory(HibernateEntityManagerFactory hemf){
		return hemf.getSessionFactory();
	}
	*/
	
}
