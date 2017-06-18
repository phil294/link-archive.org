package phil294.ls.api.model;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
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
	private static MongoCollection<Document> mongoProductCollection;
	;
	
	public MongoInstance()
	{
		mongoClient = new MongoClient("localhost", 27017);
		mongoDatabase = mongoClient.getDatabase("ls");
		mongoProductCollection = mongoDatabase.getCollection("products");
	}
	
	public static MongoCollection<Document> getProductCollection()
	{
		return mongoProductCollection;
	}
}
