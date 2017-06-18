package phil294.ls.api.model;

import org.springframework.data.repository.CrudRepository;

/**
 * User: phi
 * Date: 13.06.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public interface ProductValueRepository extends CrudRepository<ProductValue, Integer>
{
	ProductValue findOneByProductAndAttribute(int productId, int attributeId);
}
