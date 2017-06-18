package phil294.ls.api.model;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import org.springframework.stereotype.Service;

/**
 * User: phi
 * Date: 15.06.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@Service
public class MongoInstance
{
	private static MongoClient mongoClient;
	private static MongoDatabase mongoDatabase;
	
	public MongoInstance()
	{
		mongoClient = new MongoClient("localhost", 27017);
		mongoDatabase = mongoClient.getDatabase("ls");
	}
	
	public static MongoDatabase getDatabase()
	{
		return mongoDatabase;
	}
}
