<?php
namespace App\Model;

use Tymon\JWTAuth\Contracts\JWTSubject;

class Maitresse extends Personne implements JWTSubject
{
/*
	private $prenom;
    private $nom;
    private $dateNaissance;
    private $genre;
*/
	public $idMaitresse;
	public $email;
    private $motdepasse;
    private $mode = "admin";
    private $idEleveEnCours = 0;


	function __construct()
    {  
		parent::__construct();
    }
	
	public function __set($property, $value)  
	{  
		if (property_exists($this, $property))
		{  
			$this->$property = $value;  
		}  
	}

	public function __get($property)  
	{  
		if (property_exists($this, $property))
		{  
			return $this->$property;  
		}  
	}

	/**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->idMaitresse;
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return ['mode' => $this->mode, 'idEleveEnCours' => $this->idEleveEnCours];
    }
 }

